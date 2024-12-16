import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  theme: 'light' | 'dark'
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, theme }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <button onClick={onClose} className="absolute top-2 right-2">Close</button>
        {children}
      </div>
    </div>
  )
}

export default Modal 