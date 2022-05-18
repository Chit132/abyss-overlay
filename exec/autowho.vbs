Set shell = CreateObject("WScript.Shell")
shell.SendKeys "/"
WScript.Sleep 50
shell.SendKeys "who{Enter}"