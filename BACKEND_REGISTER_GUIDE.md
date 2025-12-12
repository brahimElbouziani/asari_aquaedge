# Guide Backend : Implémentation de la Création de Compte

## Vue d'ensemble

Le frontend nécessite l'endpoint `POST /Home/Creat` pour permettre aux utilisateurs de créer un compte de manière simple avec uniquement :
- Email
- Mot de passe
- Nom de l'entreprise (optionnel, utilisé comme préfixe de l'email)

---

## Endpoint Requis

### POST /Home/Creat

**Description :** Crée un nouveau compte utilisateur (admin/web).

**Request Body :**
```json
{
  "email": "user@example.com",
  "password": "A_griedge2020",
  "name_company": "user"
}
```

**Response Success (200) :**
```json
"User Add"
```
ou
```json
"Done"
```

**Response Error (400/409) :**
```json
"Already Exist!"
```
ou
```json
{
  "err": "This email already existe"
}
```

**Response Error (400) :**
```json
{
  "err": "Wrong Password exemple: A_griedge2020"
}
```

**Response Error (400) :**
```json
{
  "err": "Wrong mail"
}
```

---

## Validation Requise

### 1. Validation Email

- ✅ Email requis
- ✅ Format email valide : `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- ✅ Vérifier que l'email n'existe pas déjà dans la base de données

### 2. Validation Mot de Passe

**Format requis :** `A_griedge2020`

**Règles de validation :**
- ✅ Minimum 8 caractères
- ✅ Au moins une majuscule (A-Z)
- ✅ Au moins une minuscule (a-z)
- ✅ Au moins un chiffre (0-9)
- ✅ Au moins un caractère spécial (_, -, @, #, etc.)

**Regex de validation :**
```javascript
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/
```

### 3. Validation Nom d'Entreprise

- ✅ Optionnel (peut être vide ou null)
- ✅ Si fourni, utiliser tel quel
- ✅ Si non fourni, utiliser le préfixe de l'email (partie avant @)

---

## Exemple d'Implémentation (Node.js/Express)

```javascript
const crypto = require('crypto');
const User = require('../models/User'); // Votre modèle User

app.post('/Home/Creat', async (req, res) => {
  try {
    const { email, password, name_company } = req.body;
    
    // Validation des champs requis
    if (!email || !password) {
      return res.status(400).json({ err: "Email et mot de passe sont requis" });
    }
    
    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ err: "Wrong mail" });
    }
    
    // Validation du format du mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        err: "Wrong Password exemple: A_griedge2020" 
      });
    }
    
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ Email: email });
    if (existingUser) {
      return res.status(409).json("Already Exist!");
    }
    
    // Hasher le mot de passe (même méthode que pour le login)
    // Utiliser SHA1 ou SHA512 selon votre implémentation actuelle
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
    // OU si vous utilisez SHA512 avec salt :
    // const hashedPassword = hash(password); // Votre fonction de hashage
    
    // Déterminer le nom de l'entreprise
    const companyName = name_company || email.split('@')[0];
    
    // Créer le nouvel utilisateur
    const newUser = new User({
      Email: email,
      password: hashedPassword,
      name_company: companyName,
      firstname: '', // Optionnel, peut être vide
      lastname: '',  // Optionnel, peut être vide
      role: 'admin', // Ou 'user' selon votre logique
      createdAt: new Date()
    });
    
    await newUser.save();
    
    // Retourner le succès
    res.status(200).json("User Add");
    
  } catch (error) {
    console.error('Create user error:', error);
    
    // Gérer les erreurs spécifiques
    if (error.code === 11000) { // MongoDB duplicate key error
      return res.status(409).json("Already Exist!");
    }
    
    res.status(500).json({ 
      err: "Une erreur s'est produite lors de la création du compte" 
    });
  }
});
```

---

## Exemple d'Implémentation (Python/Flask)

```python
from flask import Flask, request, jsonify
import re
import hashlib
from datetime import datetime

@app.route('/Home/Creat', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name_company = data.get('name_company')
        
        # Validation des champs requis
        if not email or not password:
            return jsonify({'err': "Email et mot de passe sont requis"}), 400
        
        # Validation du format email
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, email):
            return jsonify({'err': "Wrong mail"}), 400
        
        # Validation du format du mot de passe
        password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$'
        if not re.match(password_regex, password):
            return jsonify({
                'err': "Wrong Password exemple: A_griedge2020"
            }), 400
        
        # Vérifier si l'email existe déjà
        existing_user = User.query.filter_by(Email=email).first()
        if existing_user:
            return jsonify("Already Exist!"), 409
        
        # Hasher le mot de passe (même méthode que pour le login)
        # Utiliser SHA1 ou SHA512 selon votre implémentation
        hashed_password = hashlib.sha1(password.encode()).hexdigest()
        # OU si vous utilisez SHA512 avec salt :
        # hashed_password = hash_password(password) # Votre fonction
        
        # Déterminer le nom de l'entreprise
        company_name = name_company or email.split('@')[0]
        
        # Créer le nouvel utilisateur
        new_user = User(
            Email=email,
            password=hashed_password,
            name_company=company_name,
            firstname='',
            lastname='',
            role='admin',
            createdAt=datetime.now()
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Retourner le succès
        return jsonify("User Add"), 200
        
    except Exception as e:
        print(f'Create user error: {str(e)}')
        
        # Gérer les erreurs spécifiques
        if 'duplicate' in str(e).lower() or 'unique' in str(e).lower():
            return jsonify("Already Exist!"), 409
        
        return jsonify({
            'err': "Une erreur s'est produite lors de la création du compte"
        }), 500
```

---

## Structure de Base de Données

### Collection/Table : `users` ou `User`

**Champs requis :**
```javascript
{
  _id: ObjectId,
  Email: String (unique, indexé),
  password: String (hashé),
  name_company: String (optionnel),
  firstname: String (optionnel, peut être vide),
  lastname: String (optionnel, peut être vide),
  role: String (default: 'admin' ou 'user'),
  createdAt: Date,
  // ... autres champs optionnels
}
```

**Index recommandé :**
- `{ Email: 1 }` - Unique index pour éviter les doublons

---

## Validation du Mot de Passe

### Fonction de Validation (JavaScript)

```javascript
function validatePassword(password) {
  // Minimum 8 caractères
  if (password.length < 8) {
    return { valid: false, error: "Le mot de passe doit contenir au moins 8 caractères" };
  }
  
  // Au moins une majuscule
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Le mot de passe doit contenir au moins une majuscule" };
  }
  
  // Au moins une minuscule
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Le mot de passe doit contenir au moins une minuscule" };
  }
  
  // Au moins un chiffre
  if (!/\d/.test(password)) {
    return { valid: false, error: "Le mot de passe doit contenir au moins un chiffre" };
  }
  
  // Au moins un caractère spécial
  if (!/[^a-zA-Z\d]/.test(password)) {
    return { valid: false, error: "Le mot de passe doit contenir au moins un caractère spécial" };
  }
  
  return { valid: true };
}

// OU utiliser une regex simple
function isPasswordValid(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/.test(password);
}
```

### Fonction de Validation (Python)

```python
import re

def validate_password(password):
    """
    Valide le format du mot de passe selon les règles :
    - Minimum 8 caractères
    - Au moins une majuscule
    - Au moins une minuscule
    - Au moins un chiffre
    - Au moins un caractère spécial
    """
    if len(password) < 8:
        return False, "Le mot de passe doit contenir au moins 8 caractères"
    
    if not re.search(r'[A-Z]', password):
        return False, "Le mot de passe doit contenir au moins une majuscule"
    
    if not re.search(r'[a-z]', password):
        return False, "Le mot de passe doit contenir au moins une minuscule"
    
    if not re.search(r'\d', password):
        return False, "Le mot de passe doit contenir au moins un chiffre"
    
    if not re.search(r'[^a-zA-Z\d]', password):
        return False, "Le mot de passe doit contenir au moins un caractère spécial"
    
    return True, None

# OU utiliser une regex simple
def is_password_valid(password):
    pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$'
    return bool(re.match(pattern, password))
```

---

## Hashage du Mot de Passe

### Important : Utiliser la Même Méthode que le Login

Le hashage doit être **identique** à celui utilisé pour le login. Vérifiez votre implémentation actuelle du login.

### Exemple 1 : SHA1 (Simple)

```javascript
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha1').update(password).digest('hex');
}
```

### Exemple 2 : SHA512 avec Salt

```javascript
const crypto = require('crypto');

function hashPassword(password, salt = null) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}
```

### Exemple 3 : Utiliser votre Fonction Existante

Si vous avez déjà une fonction de hashage dans votre codebase (par exemple dans `src/outils/hash.js`), utilisez-la :

```javascript
const { hash } = require('../outils/hash');

// Dans votre endpoint
const hashedPassword = hash(password);
```

---

## Gestion du Nom d'Entreprise

### Logique Recommandée

```javascript
// Si name_company est fourni et non vide, l'utiliser
// Sinon, utiliser le préfixe de l'email
const companyName = (name_company && name_company.trim()) 
  ? name_company.trim() 
  : email.split('@')[0];

// Exemples :
// email: "user@example.com", name_company: "" → companyName: "user"
// email: "user@example.com", name_company: "MyCompany" → companyName: "MyCompany"
// email: "john.doe@example.com", name_company: null → companyName: "john.doe"
```

---

## Codes de Statut HTTP Recommandés

| Situation | Code HTTP | Réponse |
|-----------|-----------|---------|
| Succès | 200 | `"User Add"` ou `"Done"` |
| Email déjà existant | 409 | `"Already Exist!"` |
| Format email invalide | 400 | `{ "err": "Wrong mail" }` |
| Format mot de passe invalide | 400 | `{ "err": "Wrong Password exemple: A_griedge2020" }` |
| Champs manquants | 400 | `{ "err": "Email et mot de passe sont requis" }` |
| Erreur serveur | 500 | `{ "err": "Une erreur s'est produite..." }` |

---

## Tests à Effectuer

### Test 1 : Création Réussie

**Request :**
```json
POST /Home/Creat
{
  "email": "newuser@example.com",
  "password": "A_griedge2020",
  "name_company": "MyCompany"
}
```

**Attendu :**
- Status: `200`
- Response: `"User Add"`
- Utilisateur créé dans la base de données
- Mot de passe hashé correctement

---

### Test 2 : Email Déjà Existant

**Request :**
```json
POST /Home/Creat
{
  "email": "existing@example.com",
  "password": "A_griedge2020"
}
```

**Attendu :**
- Status: `409`
- Response: `"Already Exist!"`

---

### Test 3 : Format Email Invalide

**Request :**
```json
POST /Home/Creat
{
  "email": "invalid-email",
  "password": "A_griedge2020"
}
```

**Attendu :**
- Status: `400`
- Response: `{ "err": "Wrong mail" }`

---

### Test 4 : Format Mot de Passe Invalide

**Request :**
```json
POST /Home/Creat
{
  "email": "user@example.com",
  "password": "weak"
}
```

**Attendu :**
- Status: `400`
- Response: `{ "err": "Wrong Password exemple: A_griedge2020" }`

---

### Test 5 : Champs Manquants

**Request :**
```json
POST /Home/Creat
{
  "email": "user@example.com"
}
```

**Attendu :**
- Status: `400`
- Response: `{ "err": "Email et mot de passe sont requis" }`

---

### Test 6 : Nom d'Entreprise Optionnel

**Request :**
```json
POST /Home/Creat
{
  "email": "user@example.com",
  "password": "A_griedge2020"
}
```

**Attendu :**
- Status: `200`
- Response: `"User Add"`
- `name_company` = `"user"` (préfixe de l'email)

---

## Checklist d'Implémentation

- [ ] Endpoint `POST /Home/Creat` créé
- [ ] Validation email (format et unicité)
- [ ] Validation mot de passe (format A_griedge2020)
- [ ] Hashage du mot de passe (même méthode que login)
- [ ] Gestion du nom d'entreprise (optionnel)
- [ ] Gestion des erreurs (email existant, format invalide, etc.)
- [ ] Codes HTTP appropriés (200, 400, 409, 500)
- [ ] Messages d'erreur en français
- [ ] Index unique sur Email dans la base de données
- [ ] Tests effectués pour tous les cas

---

## Notes Importantes

1. **Cohérence avec le Login :** Le hashage du mot de passe doit être **exactement le même** que celui utilisé pour le login. Sinon, les utilisateurs ne pourront pas se connecter après inscription.

2. **Format de Réponse :** Le frontend attend soit `"User Add"` soit `"Done"` en cas de succès. Utilisez `"User Add"` pour rester cohérent avec la documentation existante.

3. **Nom d'Entreprise :** Le frontend envoie le préfixe de l'email si non fourni. Le backend peut accepter ce comportement ou utiliser sa propre logique.

4. **Sécurité :** 
   - Ne jamais retourner le mot de passe (même hashé) dans la réponse
   - Ne jamais logger le mot de passe en clair
   - Valider tous les champs avant traitement

5. **Base de Données :** Assurez-vous que l'index unique sur `Email` est créé pour éviter les doublons et améliorer les performances.

---

## Exemple de Modèle (MongoDB/Mongoose)

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  name_company: {
    type: String,
    default: ''
  },
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'user']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index unique sur Email
userSchema.index({ Email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
```

---

## Exemple de Modèle (SQL/Sequelize)

```javascript
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name_company: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'admin',
    validate: {
      isIn: [['admin', 'user']]
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['Email']
    }
  ]
});
```

---

## Intégration avec le Frontend

Le frontend envoie :
```javascript
{
  email: "user@example.com",
  password: "A_griedge2020",
  name_company: "user" // Préfixe de l'email si non fourni
}
```

Le frontend attend en cas de succès :
- `result.data === "User Add"` OU
- `result.data === "Done"`

Le frontend attend en cas d'erreur :
- `result.error === "Already Exist!"` OU
- `result.error` contient le message d'erreur

---

## Contact

Si vous avez des questions ou besoin d'aide pour implémenter cet endpoint, n'hésitez pas à consulter la documentation du frontend ou à contacter l'équipe de développement.

