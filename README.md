# SSChat


## Install

```
sudo apt install python3-dev
sudo dnf install python3-devel
```


## TODO

<!-- - Encrypted localStorage to protect metadata from unconnected users: [SecurityJS](https://github.com/Parking-Master/SecurityJS.128#windowsecurestorage-api) -->
<!-- - Username in sign up form. -->
<!-- - Use IntexedDB instead of localStorage for message history -->
- Check that the CSRF cookie is invalidated when loggin out.
- Check that the message is signed. Otherwise, show the message in red.
<!-- - Show a hash of our public key and the one of our friends so make sure that chats are encrypted to the right person. -->
- Handle add/remove friends.
- Do not decrypt every messages all the time.
- Add logs.
- HTTPS
- Modal for password prompt