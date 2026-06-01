# Quick Start - Project K on New PC

**⏱️ Setup Time: ~5 minutes**

## ✅ Pre-Requisites Checklist

- [ ] OneDrive is installed and running on new PC
- [ ] OneDrive has finished syncing (check taskbar icon)
- [ ] VS Code is installed
- [ ] You have your LLM API key ready

---

## 🚀 Step-by-Step Setup (New PC)

### Step 1: Verify Files Are Synced
```
Navigate to: OneDrive - SAP SE\Projects\AI_Projects\Active\Project_K
```

**Expected to see**:
- ✅ src/ folder (with index.html, styles.css, app.js)
- ✅ docs/ folder
- ✅ deliverables/ folder
- ✅ README.md
- ✅ CLINE_CONTEXT.md (this helps Cline understand the project!)

---

### Step 2: Install Cline Extension

1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions)
3. Search: **"Cline"**
4. Click **Install**
5. Wait for installation to complete

---

### Step 3: Configure Cline with Same LLM

1. Press `Ctrl+Shift+P` (Command Palette)
2. Type: **"Cline: Open Settings"**
3. Configure these settings:

```
API Provider: [Your provider - e.g., Anthropic, OpenAI, Azure]
API Key: [Your API key]
Model: [Same model as current PC - e.g., claude-3-5-sonnet]
```

**💡 Tip**: If using VS Code Settings Sync, these settings may sync automatically!

---

### Step 4: Open Project in VS Code

1. **File** → **Open Folder**
2. Navigate to: `OneDrive - SAP SE\Projects\AI_Projects\Active\Project_K`
3. Click **Select Folder**

---

### Step 5: Test the Prototype

Verify everything works:

```bash
# Open prototype in browser
start src/index.html
```

**Test checklist**:
- [ ] Landing page loads
- [ ] Can navigate to booking form
- [ ] Duration updates when entering number of children
- [ ] Can select time slots
- [ ] Can see confirmation page
- [ ] Admin dashboard works (add #admin to URL)

---

### Step 6: Start Working with Cline

1. Open Cline panel (click Cline icon in sidebar)
2. Start a new conversation
3. **Copy-paste this to Cline**:

```
This is Project K - a Nikolaus booking system prototype that was developed on another PC.

Please read CLINE_CONTEXT.md to understand the project.

The prototype is complete and functional. I need your help with [describe what you need].
```

Cline will read the context file and understand:
- ✅ Project structure
- ✅ Design requirements
- ✅ Business logic
- ✅ What's already done
- ✅ What NOT to change

---

## 📋 Troubleshooting

### Problem: Files not visible in OneDrive folder
**Solution**: 
- Check OneDrive sync status (taskbar icon)
- Right-click OneDrive icon → Settings → Check sync status
- May need to restart OneDrive

### Problem: Cline can't see project files
**Solution**:
- Make sure you opened the Project_K folder (not parent folder)
- Reload VS Code window: `Ctrl+Shift+P` → "Reload Window"

### Problem: Prototype doesn't open
**Solution**:
- Make sure browser allows local file access
- Try different browser (Chrome recommended)
- Check file path has no spaces/special characters

### Problem: Cline doesn't remember project
**Solution**:
- This is normal! New PC = new conversation
- Just tell Cline to read CLINE_CONTEXT.md
- It will catch up immediately

---

## 🎯 You're Ready!

Once you complete these steps:
- ✅ Project is accessible on new PC
- ✅ Cline can continue where you left off
- ✅ All files are synced via OneDrive
- ✅ Prototype works exactly as before

---

## 💡 Pro Tips

### Avoid Sync Conflicts
- Close project on one PC before opening on another
- Always check OneDrive sync is complete
- Commit work frequently

### Keep Both PCs in Sync
OneDrive syncs automatically, but you can force it:
- Right-click OneDrive icon → "Sync now"

### Use Git for Extra Safety (Optional)
```bash
cd AI_Projects/Active/Project_K
git init
git add .
git commit -m "Initial commit"
```

Then push to GitHub/Azure DevOps for backup

---

## 📞 Need Help?

**Read these in order**:
1. CLINE_CONTEXT.md - Project overview for Cline
2. TRANSFER_GUIDE.md - Detailed transfer instructions
3. README.md - Project documentation

**Test Files**:
- src/index.html - Main prototype
- deliverables/ - Shareable files

---

## ✨ That's It!

Your Project K is now ready to use on your new PC with Cline.

**Next**: Open Cline and start working! 🚀

---

*Setup time: ~5 minutes*  
*Last Updated: 2026-04-29*