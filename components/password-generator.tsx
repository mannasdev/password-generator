'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import type { CheckedState } from '@radix-ui/react-checkbox'

export function PasswordGeneratorComponent() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [useReadablePattern, setUseReadablePattern] = useState(false)
  const [customPattern, setCustomPattern] = useState('')
  const { toast } = useToast()

  const generatePassword = () => {
    let charset = ''
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeNumbers) charset += '0123456789'
    if (includeSymbols) charset += '!@#$%^&*()_+{}[]|:;<>,.?/~'

    let newPassword = ''
    if (useReadablePattern) {
      const defaultWords = ["apple", "orange", "banana", "grape", "peach", "plum", "berry", "melon", "kiwi", "mango", "cherry", "pear", "lemon", "lime", "apricot", "fig", "date", "coconut", "papaya", "pineapple"]
      const words = customPattern ? customPattern.split(',') : defaultWords
      const separators = "!@#$%^&*()_+{}[]|:;<>,.?/~"
      for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
          let word = words[Math.floor(Math.random() * words.length)]
          word = word.split('').map(char => Math.random() > 0.5 ? char.toUpperCase() : char).join('')
          newPassword += word
        } else {
          newPassword += separators.charAt(Math.floor(Math.random() * separators.length))
        }
      }
      newPassword = newPassword.slice(0, length)
    } else {
      for (let i = 0; i < length; i++) {
        newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
      }
    }
    setPassword(newPassword.replace(/\s+/g, ''))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password).then(() => {
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
      })
    })
  }

  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<boolean>>) => (checked: CheckedState) => {
    if (typeof checked === 'boolean') {
      setter(checked)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Password Generator</CardTitle>
          <CardDescription>Generate a secure password with custom options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Generated Password</Label>
            <div className="flex space-x-2">
              <Input id="password" value={password} readOnly />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Password Length: {length}</Label>
            <Slider
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              min={8}
              max={32}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Include Characters</Label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={handleCheckboxChange(setIncludeUppercase)} />
                <Label htmlFor="uppercase">Uppercase</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={handleCheckboxChange(setIncludeLowercase)} />
                <Label htmlFor="lowercase">Lowercase</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={handleCheckboxChange(setIncludeNumbers)} />
                <Label htmlFor="numbers">Numbers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={handleCheckboxChange(setIncludeSymbols)} />
                <Label htmlFor="symbols">Symbols</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="readablePattern" checked={useReadablePattern} onCheckedChange={handleCheckboxChange(setUseReadablePattern)} />
                <Label htmlFor="readablePattern">Use Readable Pattern</Label>
              </div>
              {useReadablePattern && (
                <div className="space-y-2">
                  <Label htmlFor="customPattern">Custom Pattern (comma separated words)</Label>
                  <Input id="customPattern" value={customPattern} onChange={(e) => setCustomPattern(e.target.value)} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={generatePassword}>Generate Password</Button>
        </CardFooter>
      </Card>
    </div>
  )
}