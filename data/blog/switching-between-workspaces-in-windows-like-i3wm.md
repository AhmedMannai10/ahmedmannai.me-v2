---
title: 'Switching Workspaces in Windows like i3wm'
date: '2024-08-08'
tags: ['windows', 'i3wm', 'autohotkey']
draft: false
summary: 'Easily switch between multiple virtual desktops in Windows using a powerful AutoHotkey script that mimics the workspace-switching experience of the i3 window manager.'
---

As an avid user of the i3 window manager on Linux, I've become accustomed to the seamless workspace switching that it provides. However, when I have to use a Windows machine for work, I miss that level of productivity and efficiency. Fortunately, with a little help from AutoHotkey, I can recreate a similar workspace-switching experience on my Windows PC.

The script you provided is a great starting point. It allows you to easily switch between multiple virtual desktops in Windows, just like you would in i3wm. Let's break down how it works and how you can set it up on your system.

The script first maps the current desktops and their IDs from the Windows registry. This ensures that it can accurately track the current desktop and switch between them as needed. It then provides a series of hotkeys that allow you to quickly navigate between desktops.

By default, the script uses the `Alt + [1-9]` key combinations to switch to the corresponding desktop number. For example, `Alt + 2` will switch to the second desktop. You can also use the `Ctrl + Win + Left/Right` shortcuts to cycle through the desktops.

If you're more comfortable with the `CapsLock` modifier, you can uncomment the alternative key bindings in the script. This will let you use `CapsLock + [1-9]` to switch desktops, along with `CapsLock + n/p/s/a` to navigate forward, backward, and to the next/previous desktop.

The script also includes functions to create and delete virtual desktops, which can come in handy if you need to organize your workflow further.

To use this script, save it as a `.ahk` file and run it. You can also set it to automatically start when your Windows PC boots up for a seamless experience.

While it may not be as integrated as the i3wm experience, this AutoHotkey script can help bridge the gap and provide a more familiar and efficient way of navigating between workspaces on your Windows machine. Give it a try and see how it can boost your productivity!

```autohotkey
#Requires AutoHotkey v1.1.36.02
; Globals
DesktopCount = 2 ; Windows starts with 2 desktops at boot
CurrentDesktop = 1 ; Desktop count is 1-indexed (Microsoft numbers them this way)

; This function examines the registry to build an accurate list of the current virtual desktops and which one we're currently on.
; Current desktop UUID appears to be in HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\SessionInfo\1\VirtualDesktops
; List of desktops appears to be in HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VirtualDesktops

mapDesktopsFromRegistry() {
 global CurrentDesktop, DesktopCount
 ; Get the current desktop UUID. Length should be 32 always, but there's no guarantee this couldn't change in a later Windows release so we check.
 IdLength := 32
 SessionId := getSessionId()
 if (SessionId) {
 RegRead, CurrentDesktopId, HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\SessionInfo\%SessionId%\VirtualDesktops, CurrentVirtualDesktop
 if (CurrentDesktopId) {
 IdLength := StrLen(CurrentDesktopId)
 }
 }
 ; Get a list of the UUIDs for all virtual desktops on the system
 RegRead, DesktopList, HKEY_CURRENT_USER, SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VirtualDesktops, VirtualDesktopIDs
 if (DesktopList) {
 DesktopListLength := StrLen(DesktopList)
 ; Figure out how many virtual desktops there are
 DesktopCount := DesktopListLength / IdLength
 }
 else {
 DesktopCount := 1
 }
 ; Parse the REG_DATA string that stores the array of UUID's for virtual desktops in the registry.
 i := 0
 while (CurrentDesktopId and i < DesktopCount) {
 StartPos := (i * IdLength) + 1
 DesktopIter := SubStr(DesktopList, StartPos, IdLength)
 OutputDebug, The iterator is pointing at %DesktopIter% and count is %i%.
 ; Break out if we find a match in the list. If we didn't find anything, keep the
 ; old guess and pray we're still correct :-D.
 if (DesktopIter = CurrentDesktopId) {
 CurrentDesktop := i + 1
 OutputDebug, Current desktop number is %CurrentDesktop% with an ID of %DesktopIter%.
 break
 }
 i++
 }
}

; This functions finds out ID of current session.
getSessionId()
{
 ProcessId := DllCall("GetCurrentProcessId", "UInt")
 if ErrorLevel {
 OutputDebug, Error getting current process id: %ErrorLevel%
 return
 }
 OutputDebug, Current Process Id: %ProcessId%
 DllCall("ProcessIdToSessionId", "UInt", ProcessId, "UInt*", SessionId)
 if ErrorLevel {
 OutputDebug, Error getting session id: %ErrorLevel%
 return
 }
 OutputDebug, Current Session Id: %SessionId%
 return SessionId
}

; This function switches to the desktop number provided.
switchDesktopByNumber(targetDesktop)
{
 global CurrentDesktop, DesktopCount
 ; Re-generate the list of desktops and where we fit in that. We do this because
 ; the user may have switched desktops via some other means than the script.
 mapDesktopsFromRegistry()
 ; Don't attempt to switch to an invalid desktop
 if (targetDesktop > DesktopCount || targetDesktop < 1) {
 OutputDebug, [invalid] target: %targetDesktop% current: %CurrentDesktop%
 return
 }
 ; Go right until we reach the desktop we want
 while(CurrentDesktop < targetDesktop) {
 Send ^#{Right}
 CurrentDesktop++
 OutputDebug, [right] target: %targetDesktop% current: %CurrentDesktop%
 }
 ; Go left until we reach the desktop we want
 while(CurrentDesktop > targetDesktop) {
 Send ^#{Left}
 CurrentDesktop--
 OutputDebug, [left] target: %targetDesktop% current: %CurrentDesktop%
 }
}

; This function creates a new virtual desktop and switches to it
createVirtualDesktop()
{
 global CurrentDesktop, DesktopCount
 Send, #^d
 DesktopCount++
 CurrentDesktop = %DesktopCount%
 OutputDebug, [create] desktops: %DesktopCount% current: %CurrentDesktop%
}

; This function deletes the current virtual desktop
deleteVirtualDesktop()
{
 global CurrentDesktop, DesktopCount
 Send, #^{F4}
 DesktopCount--
 CurrentDesktop--
 OutputDebug, [delete] desktops: %DesktopCount% current: %CurrentDesktop%
}

; Main
SetKeyDelay, 75
mapDesktopsFromRegistry()
OutputDebug, [loading] desktops: %DesktopCount% current: %CurrentDesktop%

; User config!
; This section binds the key combo to the switch/create/delete actions
Alt & 1::switchDesktopByNumber(1)
Alt & 2::switchDesktopByNumber(2)
Alt & 3::switchDesktopByNumber(3)
Alt & 4::switchDesktopByNumber(4)
Alt & 5::switchDesktopByNumber(5)
Alt & 6::switchDesktopByNumber(6)
Alt & 7::switchDesktopByNumber(7)
Alt & 8::switchDesktopByNumber(8)
Alt & 9::switchDesktopByNumber(9)
```
