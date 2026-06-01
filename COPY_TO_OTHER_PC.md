# Copy Project K to Other PC (Different OneDrive)

**Situation**: Your other PC uses a different OneDrive account, so files won't auto-sync.

**Solution**: Manual copy using one of these methods.

---

## 🎯 Recommended: USB Stick or Network Share

### Method 1: USB Stick (EASIEST) ⭐

**On Current PC:**

1. **Insert USB stick**

2. **Copy the entire Project_K folder**:
   ```
   From: C:\Users\I761501\OneDrive - SAP SE\Projects\AI_Projects\Active\Project_K
   To: [USB Drive]\Project_K
   ```

3. **Eject USB safely**

**On Other PC:**

4. **Insert USB stick**

5. **Copy to desired location**:
   ```
   From: [USB Drive]\Project_K
   To: C:\Users\[YourUser]\Documents\Projects\AI_Projects\Active\Project_K
   OR
   To: [Other OneDrive]\Projects\AI_Projects\Active\Project_K
   ```

6. **Follow QUICK_START_NEW_PC.md** to set up Cline

**Pros**: 
- ✅ Simple, fast
- ✅ Works offline
- ✅ One-time copy

**Cons**: 
- ⚠️ Need USB stick
- ⚠️ Manual sync for updates

---

## Method 2: Compress and Email/Teams

**On Current PC:**

The ZIP file is already created for you!

**Location**: 
```
AI_Projects\Active\Project_K\deliverables\Nikolaus-Booking-Prototype.zip
```

**Send via**:
- ✅ Email to yourself
- ✅ Microsoft Teams chat to yourself
- ✅ Upload to personal cloud (Google Drive, Dropbox)

**On Other PC:**

1. Download the ZIP file
2. Extract to: `[Desired Location]\Project_K`
3. Follow QUICK_START_NEW_PC.md

**Pros**: 
- ✅ No USB needed
- ✅ Works remotely
- ✅ Small file size (~35 KB)

**Cons**: 
- ⚠️ Only includes src/ folder (not all documentation)
- ⚠️ Need to copy docs separately if needed

---

## Method 3: Create Complete ZIP Package

**I'll create a complete package including all documentation:**

**On Current PC:**

Run this PowerShell command:

```powershell
Compress-Archive -Path "AI_Projects\Active\Project_K\*" -DestinationPath "$env:USERPROFILE\Desktop\Project_K_Complete.zip" -Force
```

This creates `Project_K_Complete.zip` on your Desktop with EVERYTHING:
- ✅ src/ (prototype)
- ✅ docs/ (documentation)  
- ✅ deliverables/ (shareable files)
- ✅ All guides (CLINE_CONTEXT.md, TRANSFER_GUIDE.md, etc.)

**Send to other PC via**:
- Email (if < 25 MB)
- Teams
- WeTransfer
- Google Drive / Dropbox

**On Other PC:**

1. Download `Project_K_Complete.zip`
2. Extract to your projects folder
3. Follow QUICK_START_NEW_PC.md

---

## Method 4: Git Repository (BEST LONG-TERM)

**On Current PC:**

```bash
cd AI_Projects\Active\Project_K

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Project K complete prototype"

# Create repository on GitHub
# Then push (replace URL with your repo):
git remote add origin https://github.com/YOUR_USERNAME/project-k.git
git push -u origin main
```

**On Other PC:**

```bash
cd [Your Projects Folder]
git clone https://github.com/YOUR_USERNAME/project-k.git Project_K
```

**Pros**: 
- ✅ Best for long-term
- ✅ Easy sync between PCs
- ✅ Version history
- ✅ Backup included

**Cons**: 
- ⚠️ Requires GitHub account
- ⚠️ Initial setup needed

---

## Method 5: Network Share (If Both PCs on Same Network)

**On Current PC:**

1. Share the Project_K folder:
   - Right-click folder → Properties → Sharing → Advanced Sharing
   - Check "Share this folder"
   - Note the network path (e.g., `\\CURRENT-PC\Projects\Project_K`)

**On Other PC:**

1. Open File Explorer
2. In address bar, type: `\\CURRENT-PC\Projects\Project_K`
3. Copy entire folder to local drive

**Pros**: 
- ✅ Fast if on same network
- ✅ No external media needed

**Cons**: 
- ⚠️ Both PCs must be on same network
- ⚠️ Current PC must be on

---

## 🎯 Quick Decision Guide

**Choose based on your situation:**

| Situation | Best Method |
|-----------|-------------|
| PCs in different locations | Method 2 (Email/Teams) or Method 4 (Git) |
| PCs in same location | Method 1 (USB) |
| Want easy future syncing | Method 4 (Git) |
| One-time transfer | Method 1 (USB) or Method 2 (Email) |
| Both PCs at home/office | Method 5 (Network Share) |

---

## ⚡ Fastest Option Right Now

### OPTION A: Email the existing ZIP
```
File: AI_Projects\Active\Project_K\deliverables\Nikolaus-Booking-Prototype.zip
Size: ~35 KB
Contains: src/ folder (complete prototype)
```

**Steps**:
1. Email to yourself
2. Download on other PC
3. Extract and add documentation files manually if needed

### OPTION B: Create complete package
```powershell
# Run on current PC:
Compress-Archive -Path "AI_Projects\Active\Project_K\*" -DestinationPath "$env:USERPROFILE\Desktop\Project_K_Complete.zip" -Force
```
Then email/transfer this file.

---

## 📋 What to Copy (Minimum)

If doing manual copy, these are ESSENTIAL:

**Must Have**:
```
Project_K/
├── src/                      # The prototype
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── CLINE_CONTEXT.md         # For Cline on new PC ⭐
├── README.md                # Project overview
└── QUICK_START_NEW_PC.md    # Setup guide
```

**Recommended Also Copy**:
```
├── TASKS_LOG.md             # Work history
├── TRANSFER_GUIDE.md        # This guide
├── docs/
│   └── STAKEHOLDER_GUIDE.md
└── deliverables/
    └── SHARING_GUIDE.md
```

---

## 🔄 Keeping Both PCs in Sync (After Initial Copy)

### Option 1: Git (Recommended)
```bash
# On PC where you made changes:
git add .
git commit -m "Updated [what you changed]"
git push

# On other PC:
git pull
```

### Option 2: Manual Sync
- Work on one PC at a time
- Copy changed files to USB
- Copy from USB to other PC
- Keep notes on which PC has latest version

### Option 3: Cloud Service
- Put Project_K in Dropbox/Google Drive folder
- Both PCs access same folder
- Automatic sync

---

## ✅ After Copy: Setup on Other PC

1. **Verify all files copied correctly**
2. **Open VS Code**
3. **Install Cline extension**
4. **Open Project_K folder**
5. **Configure Cline with your LLM settings**
6. **Tell Cline**: 
   ```
   This is Project K. Please read CLINE_CONTEXT.md to understand the project.
   ```
7. **Start working!**

---

## 🚨 Important Notes

### File Paths Will Be Different
- Current PC: `OneDrive - SAP SE\Projects\AI_Projects\Active\Project_K`
- Other PC: `[Wherever you copy it]\Project_K`

**This is fine!** The prototype uses relative paths, so it will work from any location.

### OneDrive on Other PC
If your other PC has different OneDrive:
- Either copy outside OneDrive (e.g., `Documents\Projects\`)
- Or into your personal OneDrive folder
- Your choice - project works from anywhere

### Cline Will Need Reintroduction
- Each PC = separate Cline conversation
- On new PC, tell Cline to read CLINE_CONTEXT.md
- It will understand the project immediately

---

## 💡 My Recommendation

**For you (different OneDrive accounts):**

1. **Now**: Use Method 3 (create complete ZIP)
   - Run the PowerShell command
   - Email ZIP to yourself
   - Extract on other PC

2. **Long-term**: Set up Method 4 (Git)
   - Best for keeping PCs in sync
   - Adds version control
   - Works as backup too

---

## Need the Complete ZIP Now?

Want me to create the command for you? Just confirm and I'll generate the complete ZIP file on your Desktop ready to transfer.

---

*This guide covers manual copy since your other PC uses different OneDrive*  
*Choose the method that fits your situation best*