import { useEffect, useState } from 'react'

export function useTypingEffect(words, typingSpeed = 80, deletingSpeed = 50, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentWord.slice(0, displayText.length + 1))
        if (displayText === currentWord) {
          setTimeout(() => setIsDeleting(true), pauseTime)
          return
        }
      } else {
        setDisplayText(currentWord.slice(0, displayText.length - 1))
        if (displayText === '') {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime])

  return displayText
}
