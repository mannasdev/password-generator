'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import type { CheckedState } from '@radix-ui/react-checkbox'

export function PasswordGeneratorComponent() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [useReadablePattern, setUseReadablePattern] = useState(false)
  const [customPattern, setCustomPattern] = useState('')
  const [makeHilarious, setMakeHilarious] = useState(false)
  const [makeKlingon, setMakeKlingon] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveKey, setSaveKey] = useState('')
  const [savedPasswords, setSavedPasswords] = useState<{[key: string]: string}>({})
  const { toast } = useToast()

  useEffect(() => {
    const storedPasswords = localStorage.getItem('savedPasswords')
    if (storedPasswords) {
      setSavedPasswords(JSON.parse(storedPasswords))
    }
  }, [])

  function generatePassword(length: number, charset: string): string {
    let password = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password).then(() => {
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
      })
    })
  }

  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<boolean>>) => (checked: boolean) => {
    if (typeof checked === 'boolean') {
      setter(checked)
    }
  }

  const savePassword = () => {
    if (saveKey) {
      const updatedPasswords = { ...savedPasswords, [saveKey]: password }
      setSavedPasswords(updatedPasswords)
      localStorage.setItem('savedPasswords', JSON.stringify(updatedPasswords))
      setShowSaveDialog(false)
      setSaveKey('')
      toast({
        title: "Saved!",
        description: "Password saved to local storage",
      })
    }
  }

  const getCharset = () => {
    let charset = '0123456789'
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeSymbols) charset += '!@#$%^&*()_+{}[]|:;<>,.?/~'
    return charset
  }

  const handleGeneratePassword = () => {
    const charset = getCharset()
    const newPassword = generatePassword(length, charset)
    setPassword(newPassword)
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
              onValueChange={(value: number[]) => setLength(value[0])}
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
                <Checkbox id="numbers" checked={true} disabled />
                <Label htmlFor="numbers">Numbers (Always included)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={handleCheckboxChange(setIncludeSymbols)} />
                <Label htmlFor="symbols">Symbols</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="readablePattern" checked={useReadablePattern} onCheckedChange={handleCheckboxChange(setUseReadablePattern)} />
                <Label htmlFor="readablePattern">Use Readable Pattern</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="makeHilarious" checked={makeHilarious} onCheckedChange={handleCheckboxChange(setMakeHilarious)} />
                <Label htmlFor="makeHilarious">Make it Hilarious</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="makeKlingon" checked={makeKlingon} onCheckedChange={handleCheckboxChange(setMakeKlingon)} />
                <Label htmlFor="makeKlingon">Make it Pronounceable in Klingon</Label>
              </div>
              {useReadablePattern && !makeHilarious && !makeKlingon && (
                <div className="space-y-2">
                  <Label htmlFor="customPattern">Custom Pattern (comma separated words)</Label>
                  <Input id="customPattern" value={customPattern} onChange={(e) => setCustomPattern(e.target.value)} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={handleGeneratePassword}>Generate Password</Button>
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogContent className="bg-white text-black">
              <DialogHeader>
                <DialogTitle>Save Password</DialogTitle>
                <DialogDescription>
                  Do you want to save this password in local storage? The password will not reach the server and can only be seen by you.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Enter a key to save the password"
                value={saveKey}
                onChange={(e) => setSaveKey(e.target.value)}
              />
              <DialogFooter>
                <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
                <Button onClick={savePassword}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">View Saved Passwords</Button>
            </DialogTrigger>
            <DialogContent className="bg-white text-black">
              <DialogHeader>
                <DialogTitle>Saved Passwords</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {Object.entries(savedPasswords).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span>{key}: {value}</span>
                    <Button onClick={() => {
                      navigator.clipboard.writeText(value)
                      toast({
                        title: "Copied!",
                        description: "Password copied to clipboard",
                      })
                    }}>Copy</Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  )
}