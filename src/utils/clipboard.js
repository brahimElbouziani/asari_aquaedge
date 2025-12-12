import Clipboard from 'clipboard'

// Vue 3 compatible clipboard handler
// Note: This function should be called from within a component context
// to access the toast service. For standalone use, pass toast instance.
export default function handleClipboard(text, event, toast = null) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  
  clipboard.on('success', () => {
    if (toast) {
      toast.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Copy successfully', 
        life: 1500 
      })
    } else {
      // Fallback: use browser's native notification
      console.log('Copy successfully')
    }
    clipboard.destroy()
  })
  
  clipboard.on('error', () => {
    if (toast) {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Copy failed' 
      })
    } else {
      // Fallback: use browser's native notification
      console.error('Copy failed')
    }
    clipboard.destroy()
  })
  
  clipboard.onClick(event)
}
