# Guide Backend : Implémentation du Mot de Passe Oublié

## Vue d'ensemble

Le frontend nécessite 3 endpoints pour la fonctionnalité "Mot de passe oublié" :
1. **POST /Home/forgotPassword** - Envoyer un code de réinitialisation par email
2. **POST /Home/verifyResetCode** - Vérifier le code de réinitialisation
3. **POST /Home/resetPassword** - Réinitialiser le mot de passe avec le code

## Endpoints Requis

### 1. POST /Home/forgotPassword

**Description :** Envoie un code de réinitialisation à 6 chiffres à l'email de l'utilisateur.

**Request Body :**
```json
{
  "email": "user@example.com"
}
```

**Response Success (200) :**
```json
{
  "message": "Code de réinitialisation envoyé avec succès",
  "success": true
}
```

**Response Error (400/404) :**
```json
{
  "err": "Aucun compte trouvé avec cet email"
}
```

**Response Error (500) :**
```json
{
  "err": "Impossible d'envoyer l'email. Veuillez réessayer plus tard"
}
```

### 2. POST /Home/verifyResetCode

**Description :** Vérifie si le code de réinitialisation est valide.

**Request Body :**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response Success (200) :**
```json
{
  "message": "Code vérifié avec succès",
  "success": true,
  "token": "reset_token_here" // Optionnel : token temporaire pour la réinitialisation
}
```

**Response Error (400) :**
```json
{
  "err": "Code de vérification invalide ou expiré"
}
```

**Response Error (404) :**
```json
{
  "err": "Aucun code de réinitialisation trouvé pour cet email"
}
```

### 3. POST /Home/resetPassword

**Description :** Réinitialise le mot de passe de l'utilisateur avec le code de vérification.

**Request Body :**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "A_griedge2020"
}
```

**Response Success (200) :**
```json
{
  "message": "Mot de passe réinitialisé avec succès",
  "success": true
}
```

**Response Error (400) :**
```json
{
  "err": "Code de vérification invalide ou expiré"
}
```

**Response Error (400) :**
```json
{
  "err": "Wrong Password exemple: A_griedge2020"
}
```

**Response Error (404) :**
```json
{
  "err": "Aucun compte trouvé avec cet email"
}
```

## Structure de Base de Données

### Option 1 : Collection séparée pour les codes de réinitialisation

```javascript
// Collection: passwordResetCodes
{
  _id: ObjectId,
  email: String,           // Email de l'utilisateur
  code: String,            // Code à 6 chiffres
  expiresAt: Date,          // Date d'expiration (15 minutes)
  used: Boolean,           // Si le code a été utilisé
  createdAt: Date          // Date de création
}
```

### Option 2 : Ajouter les champs à la collection User

```javascript
// Collection: users
{
  _id: ObjectId,
  Email: String,
  password: String,
  // ... autres champs
  
  // Nouveaux champs pour la réinitialisation
  resetCode: String,       // Code de réinitialisation
  resetCodeExpiresAt: Date, // Date d'expiration
  resetCodeUsed: Boolean   // Si le code a été utilisé
}
```

## Exemple d'Implémentation (Node.js/Express)

### 1. POST /Home/forgotPassword

```javascript
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // Ou votre service d'email

app.post('/Home/forgotPassword', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validation
    if (!email) {
      return res.status(400).json({ err: "L'email est requis" });
    }
    
    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ err: "Format d'email invalide" });
    }
    
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ Email: email });
    if (!user) {
      // Pour des raisons de sécurité, ne pas révéler si l'email existe
      return res.status(200).json({ 
        message: "Si cet email existe, un code de réinitialisation a été envoyé",
        success: true 
      });
    }
    
    // Générer un code à 6 chiffres
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Date d'expiration (15 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    
    // Option 1 : Sauvegarder dans une collection séparée
    await PasswordResetCode.findOneAndUpdate(
      { email: email },
      {
        email: email,
        code: resetCode,
        expiresAt: expiresAt,
        used: false,
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    // Option 2 : Sauvegarder dans la collection User
    // await User.findOneAndUpdate(
    //   { Email: email },
    //   {
    //     resetCode: resetCode,
    //     resetCodeExpiresAt: expiresAt,
    //     resetCodeUsed: false
    //   }
    // );
    
    // Envoyer l'email avec le code
    await sendResetCodeEmail(email, resetCode);
    
    // Logger pour le debug (ne pas retourner le code dans la réponse)
    console.log(`Reset code for ${email}: ${resetCode}`); // À retirer en production
    
    res.status(200).json({
      message: "Code de réinitialisation envoyé avec succès",
      success: true
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      err: "Impossible d'envoyer l'email. Veuillez réessayer plus tard" 
    });
  }
});
```

### 2. POST /Home/verifyResetCode

```javascript
app.post('/Home/verifyResetCode', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    // Validation
    if (!email || !code) {
      return res.status(400).json({ err: "Email et code sont requis" });
    }
    
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ err: "Le code doit contenir 6 chiffres" });
    }
    
    // Option 1 : Chercher dans la collection séparée
    const resetCode = await PasswordResetCode.findOne({
      email: email,
      code: code,
      used: false,
      expiresAt: { $gt: new Date() } // Code non expiré
    });
    
    // Option 2 : Chercher dans la collection User
    // const user = await User.findOne({
    //   Email: email,
    //   resetCode: code,
    //   resetCodeUsed: false,
    //   resetCodeExpiresAt: { $gt: new Date() }
    // });
    
    if (!resetCode) {
      return res.status(400).json({ 
        err: "Code de vérification invalide ou expiré" 
      });
    }
    
    // Optionnel : Générer un token temporaire pour la réinitialisation
    const resetToken = jwt.sign(
      { email: email, code: code, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    res.status(200).json({
      message: "Code vérifié avec succès",
      success: true,
      token: resetToken // Optionnel
    });
    
  } catch (error) {
    console.error('Verify reset code error:', error);
    res.status(500).json({ 
      err: "Une erreur s'est produite. Veuillez réessayer" 
    });
  }
});
```

### 3. POST /Home/resetPassword

```javascript
const bcrypt = require('bcrypt');

app.post('/Home/resetPassword', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    // Validation
    if (!email || !code || !newPassword) {
      return res.status(400).json({ err: "Tous les champs sont requis" });
    }
    
    // Validation du format du code
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ err: "Le code doit contenir 6 chiffres" });
    }
    
    // Validation du mot de passe (même format que le login)
    // Format requis : A_griedge2020 (majuscule, minuscule, chiffre, caractère spécial, min 8 chars)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        err: "Wrong Password exemple: A_griedge2020" 
      });
    }
    
    // Vérifier le code de réinitialisation
    // Option 1 : Collection séparée
    const resetCode = await PasswordResetCode.findOne({
      email: email,
      code: code,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetCode) {
      return res.status(400).json({ 
        err: "Code de vérification invalide ou expiré" 
      });
    }
    
    // Option 2 : Collection User
    // const user = await User.findOne({
    //   Email: email,
    //   resetCode: code,
    //   resetCodeUsed: false,
    //   resetCodeExpiresAt: { $gt: new Date() }
    // });
    // 
    // if (!user) {
    //   return res.status(400).json({ 
    //     err: "Code de vérification invalide ou expiré" 
    //   });
    // }
    
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ Email: email });
    if (!user) {
      return res.status(404).json({ err: "Aucun compte trouvé avec cet email" });
    }
    
    // Hasher le nouveau mot de passe (même méthode que pour le login)
    const hashedPassword = crypto.createHash('sha1').update(newPassword).digest('hex');
    
    // Mettre à jour le mot de passe
    await User.findOneAndUpdate(
      { Email: email },
      { password: hashedPassword }
    );
    
    // Marquer le code comme utilisé
    // Option 1 : Collection séparée
    await PasswordResetCode.findOneAndUpdate(
      { email: email, code: code },
      { used: true }
    );
    
    // Option 2 : Collection User
    // await User.findOneAndUpdate(
    //   { Email: email },
    //   { 
    //     resetCodeUsed: true,
    //     resetCode: null,
    //     resetCodeExpiresAt: null
    //   }
    // );
    
    res.status(200).json({
      message: "Mot de passe réinitialisé avec succès",
      success: true
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      err: "Une erreur s'est produite. Veuillez réessayer" 
    });
  }
});
```

## Fonction d'Envoi d'Email

```javascript
const nodemailer = require('nodemailer');

async function sendResetCodeEmail(email, code) {
  // Configuration du transporteur email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true pour 465, false pour autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  
  // Contenu de l'email
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@yourapp.com',
    to: email,
    subject: 'Code de réinitialisation de mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Votre code de vérification est :</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px;">
          ${code}
        </div>
        <p>Ce code est valide pendant <strong>15 minutes</strong>.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          © ${new Date().getFullYear()} Votre Application. Tous droits réservés.
        </p>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
}
```

## Exemple d'Implémentation (Python/Flask)

```python
from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import random
import hashlib
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

@app.route('/Home/forgotPassword', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get('email')
        
        # Validation
        if not email:
            return jsonify({'err': "L'email est requis"}), 400
        
        # Vérifier si l'utilisateur existe
        user = User.query.filter_by(Email=email).first()
        if not user:
            # Pour des raisons de sécurité, ne pas révéler si l'email existe
            return jsonify({
                'message': "Si cet email existe, un code de réinitialisation a été envoyé",
                'success': True
            }), 200
        
        # Générer un code à 6 chiffres
        reset_code = str(random.randint(100000, 999999))
        
        # Date d'expiration (15 minutes)
        expires_at = datetime.now() + timedelta(minutes=15)
        
        # Sauvegarder le code
        reset_code_obj = PasswordResetCode.query.filter_by(email=email).first()
        if reset_code_obj:
            reset_code_obj.code = reset_code
            reset_code_obj.expires_at = expires_at
            reset_code_obj.used = False
        else:
            reset_code_obj = PasswordResetCode(
                email=email,
                code=reset_code,
                expires_at=expires_at,
                used=False
            )
            db.session.add(reset_code_obj)
        
        db.session.commit()
        
        # Envoyer l'email
        send_reset_code_email(email, reset_code)
        
        return jsonify({
            'message': "Code de réinitialisation envoyé avec succès",
            'success': True
        }), 200
        
    except Exception as e:
        print(f'Forgot password error: {str(e)}')
        return jsonify({
            'err': "Impossible d'envoyer l'email. Veuillez réessayer plus tard"
        }), 500

@app.route('/Home/verifyResetCode', methods=['POST'])
def verify_reset_code():
    try:
        data = request.get_json()
        email = data.get('email')
        code = data.get('code')
        
        # Validation
        if not email or not code:
            return jsonify({'err': "Email et code sont requis"}), 400
        
        if len(code) != 6 or not code.isdigit():
            return jsonify({'err': "Le code doit contenir 6 chiffres"}), 400
        
        # Vérifier le code
        reset_code = PasswordResetCode.query.filter_by(
            email=email,
            code=code,
            used=False
        ).first()
        
        if not reset_code or reset_code.expires_at < datetime.now():
            return jsonify({
                'err': "Code de vérification invalide ou expiré"
            }), 400
        
        return jsonify({
            'message': "Code vérifié avec succès",
            'success': True
        }), 200
        
    except Exception as e:
        print(f'Verify reset code error: {str(e)}')
        return jsonify({
            'err': "Une erreur s'est produite. Veuillez réessayer"
        }), 500

@app.route('/Home/resetPassword', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        email = data.get('email')
        code = data.get('code')
        new_password = data.get('newPassword')
        
        # Validation
        if not email or not code or not new_password:
            return jsonify({'err': "Tous les champs sont requis"}), 400
        
        # Validation du mot de passe
        import re
        password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$'
        if not re.match(password_regex, new_password):
            return jsonify({
                'err': "Wrong Password exemple: A_griedge2020"
            }), 400
        
        # Vérifier le code
        reset_code = PasswordResetCode.query.filter_by(
            email=email,
            code=code,
            used=False
        ).first()
        
        if not reset_code or reset_code.expires_at < datetime.now():
            return jsonify({
                'err': "Code de vérification invalide ou expiré"
            }), 400
        
        # Vérifier si l'utilisateur existe
        user = User.query.filter_by(Email=email).first()
        if not user:
            return jsonify({
                'err': "Aucun compte trouvé avec cet email"
            }), 404
        
        # Hasher le mot de passe (même méthode que le login)
        hashed_password = hashlib.sha1(new_password.encode()).hexdigest()
        
        # Mettre à jour le mot de passe
        user.password = hashed_password
        db.session.commit()
        
        # Marquer le code comme utilisé
        reset_code.used = True
        db.session.commit()
        
        return jsonify({
            'message': "Mot de passe réinitialisé avec succès",
            'success': True
        }), 200
        
    except Exception as e:
        print(f'Reset password error: {str(e)}')
        return jsonify({
            'err': "Une erreur s'est produite. Veuillez réessayer"
        }), 500

def send_reset_code_email(email, code):
    # Configuration SMTP
    smtp_server = os.getenv('SMTP_HOST')
    smtp_port = int(os.getenv('SMTP_PORT', 587))
    smtp_user = os.getenv('SMTP_USER')
    smtp_pass = os.getenv('SMTP_PASS')
    
    # Créer le message
    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Code de réinitialisation de mot de passe'
    msg['From'] = os.getenv('SMTP_FROM', 'noreply@yourapp.com')
    msg['To'] = email
    
    # Contenu HTML
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Votre code de vérification est :</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px;">
            {code}
        </div>
        <p>Ce code est valide pendant <strong>15 minutes</strong>.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    </div>
    """
    
    part = MIMEText(html, 'html')
    msg.attach(part)
    
    # Envoyer l'email
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
```

## Modèle de Base de Données (MongoDB/Mongoose)

```javascript
// Modèle PasswordResetCode
const mongoose = require('mongoose');

const passwordResetCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // Auto-suppression après expiration
  },
  used: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour la recherche rapide
passwordResetCodeSchema.index({ email: 1, code: 1, used: 1 });
passwordResetCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PasswordResetCode', passwordResetCodeSchema);
```

## Sécurité et Bonnes Pratiques

### 1. Expiration des Codes
- **Durée recommandée :** 15 minutes
- **Auto-suppression :** Utiliser TTL index dans MongoDB pour supprimer automatiquement les codes expirés

### 2. Limitation du Taux (Rate Limiting)
```javascript
// Limiter à 3 tentatives par email toutes les 15 minutes
const rateLimit = require('express-rate-limit');

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requêtes max
  message: { err: "Trop de tentatives. Veuillez réessayer plus tard." }
});

app.post('/Home/forgotPassword', forgotPasswordLimiter, forgotPassword);
```

### 3. Validation du Mot de Passe
- Utiliser la même validation que pour le login
- Format requis : `A_griedge2020` (majuscule, minuscule, chiffre, caractère spécial, min 8 chars)

### 4. Sécurité Email
- Ne jamais retourner le code dans la réponse API
- Logger le code uniquement en développement
- Utiliser HTTPS pour toutes les communications

### 5. Nettoyage des Codes
- Marquer les codes comme "used" après utilisation
- Supprimer automatiquement les codes expirés (TTL index)
- Nettoyer les codes utilisés après 24 heures

## Checklist d'Implémentation

- [ ] Créer la structure de base de données (collection ou champs dans User)
- [ ] Implémenter `POST /Home/forgotPassword`
- [ ] Implémenter `POST /Home/verifyResetCode`
- [ ] Implémenter `POST /Home/resetPassword`
- [ ] Configurer le service d'envoi d'email (SMTP)
- [ ] Ajouter la validation du format de mot de passe
- [ ] Implémenter l'expiration des codes (15 minutes)
- [ ] Ajouter le rate limiting pour éviter les abus
- [ ] Tester tous les cas d'erreur
- [ ] Tester le flux complet (email → code → reset)
- [ ] Logger les erreurs pour le debug
- [ ] Sécuriser les endpoints (HTTPS, validation)

## Variables d'Environnement Requises

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourapp.com

# JWT Secret (si vous utilisez des tokens)
JWT_SECRET=your-secret-key
```

## Tests à Effectuer

1. **Test Email Inexistant**
   - Requête : `{ "email": "nonexistent@example.com" }`
   - Attendu : Succès (pour ne pas révéler si l'email existe)

2. **Test Code Invalide**
   - Requête : `{ "email": "user@example.com", "code": "000000" }`
   - Attendu : `{ "err": "Code de vérification invalide ou expiré" }`

3. **Test Code Expiré**
   - Attendre 15+ minutes après la génération
   - Attendu : `{ "err": "Code de vérification invalide ou expiré" }`

4. **Test Mot de Passe Invalide**
   - Requête : `{ "email": "...", "code": "...", "newPassword": "weak" }`
   - Attendu : `{ "err": "Wrong Password exemple: A_griedge2020" }`

5. **Test Flux Complet**
   - Demander le code → Vérifier le code → Réinitialiser le mot de passe
   - Attendu : Succès à chaque étape

## Notes Importantes

1. **Sécurité** : Ne jamais révéler si un email existe ou non dans la base de données lors de la demande de code (pour éviter l'énumération d'emails).

2. **Expiration** : Les codes doivent expirer après 15 minutes pour des raisons de sécurité.

3. **Usage Unique** : Chaque code ne peut être utilisé qu'une seule fois.

4. **Format de Mot de Passe** : Utiliser exactement la même validation que pour le login (`A_griedge2020`).

5. **Hashing** : Utiliser la même méthode de hashage que pour le login (SHA1 dans votre cas).

## Contact

Si vous avez des questions ou besoin d'aide pour implémenter ces endpoints, n'hésitez pas à consulter la documentation du frontend ou à contacter l'équipe de développement.

