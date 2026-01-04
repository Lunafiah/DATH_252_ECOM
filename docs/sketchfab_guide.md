# How to Use Sketchfab - Complete Guide

## 🎯 Goal

Download a free sofa 3D model from Sketchfab and add it to your product page.

---

## 📋 **Step-by-Step Instructions**

### **Step 1: Go to Sketchfab**

Open this link in your browser:

```
https://sketchfab.com/search?features=downloadable&licenses=322a749bcfa841b29dff1e8a1bb74b0b&q=velvet+sofa&type=models
```

**What this link does:**

- ✅ Shows only **downloadable** models
- ✅ Shows only **free CC-licensed** models
- ✅ Searches for "velvet sofa"

---

### **Step 2: Pick a Sofa Model**

**Look for:**

- ✅ Green "Download 3D Model" button
- ✅ Good preview (rotate the model to check quality)
- ✅ Reasonable file size (under 50MB)
- ✅ Has textures/colors

**Good examples:**

- "Modern Sofa" by various artists
- "Velvet Couch" models
- "Living Room Sofa" models

---

### **Step 3: Download the Model**

1. **Click on a model** you like
2. **Click "Download 3D Model"** (green button)
3. **Select format**: Choose **"glTF Binary (.glb)"**
   - ⚠️ **Important**: Pick GLB, not GLTF, OBJ, or FBX!
4. **Click "Download"**
5. **Wait** for download to complete (usually 2-20MB)

**File will be saved to:** `C:\Users\Lunafiah\Downloads\`

---

### **Step 4: Copy to Your Project**

Open PowerShell and run:

```powershell
# Navigate to your project
cd "C:\Users\Lunafiah\Desktop\Study\Đồ án CNPM\DATH_252_ECOM"

# Create models directory if it doesn't exist
mkdir public\models -ErrorAction SilentlyContinue

# Copy the downloaded file (adjust filename if different)
copy "C:\Users\Lunafiah\Downloads\*.glb" public\models\sofa.glb
```

**Or manually:**

1. Open File Explorer
2. Go to `Downloads` folder
3. Find the `.glb` file
4. Copy it to: `C:\Users\Lunafiah\Desktop\Study\Đồ án CNPM\DATH_252_ECOM\public\models\`
5. Rename it to: `sofa.glb`

---

### **Step 5: Update Database**

The database already has the astronaut model. Let's update it to use the sofa:

```powershell
# Navigate to server directory
cd server

# Edit update-product-3d.js to ensure it uses local path
# (It should already be correct from before)

# Run the update script
node update-product-3d.js
```

**Expected output:**

```
✅ Connected to MongoDB
✅ Product updated successfully!
📦 Updated product: The Emerald Velvet Sofa
🎨 3D Model data: { glb: '/models/sofa.glb' }
✅ Connection closed
```

---

### **Step 6: Verify It Works**

1. **Open browser**: `http://localhost:3000/product/1`
2. **Scroll down** past the main product image
3. **You should see** the sofa 3D model!
4. **Test interactions:**
   - 🖱️ Drag to rotate
   - 🔍 Scroll to zoom
   - 📱 AR button on mobile

---

## 🎨 **Alternative Search Terms**

If you don't like the velvet sofas, try searching for:

- **"modern sofa"** - Contemporary designs
- **"couch"** - More casual styles
- **"sectional sofa"** - L-shaped sofas
- **"leather sofa"** - Leather textures
- **"minimalist sofa"** - Simple, clean designs

**Always add these filters:**

- ✅ Downloadable
- ✅ Free (CC License)

---

## 🐛 **Troubleshooting**

### **"No Download Button"**

- Model isn't free/downloadable
- Try a different model

### **"Wrong Format Downloaded"**

- Make sure you selected **GLB**, not GLTF/OBJ/FBX
- Re-download with correct format

### **"Model Too Big"**

- File over 50MB may be slow to load
- Try a different, smaller model
- Or use online tools to compress: https://gltf.report/

### **"Model Doesn't Show Up"**

1. Check file exists: `public\models\sofa.glb`
2. Check browser console (F12) for errors
3. Hard refresh: `Ctrl+F5`
4. Verify database was updated

### **"Model is Rotated Wrong"**

Edit `Product3DViewer.jsx` and add:

```javascript
<model-viewer
  orientation="0deg 90deg 0deg"  // Adjust rotation
  ...
>
```

### **"Model is Too Big/Small"**

Edit `Product3DViewer.jsx`:

```javascript
<model-viewer
  camera-orbit="0deg 75deg 3m"  // Adjust last number (zoom)
  ...
>
```

---

## ✅ **Success Checklist**

- [ ] Downloaded GLB file from Sketchfab
- [ ] Copied to `public/models/sofa.glb`
- [ ] Updated database with `node update-product-3d.js`
- [ ] Refreshed browser
- [ ] Can see and interact with 3D model
- [ ] Drag to rotate works
- [ ] Scroll to zoom works

---

## 🎯 **Next Steps**

Once you have one working:

1. **Add more products** - Repeat for other furniture
2. **Optimize models** - Compress large files
3. **Add USDZ** - For better iOS AR support
4. **Customize viewer** - Adjust colors, lighting, etc.

---

## 💡 **Pro Tips**

- **Preview before download** - Rotate the model on Sketchfab first
- **Check poly count** - Lower is better for web (under 100k triangles)
- **Look for PBR materials** - Better lighting/reflections
- **Read license** - Most are CC-BY (attribution required)
- **Save favorites** - Create Sketchfab account to save models

---

## 📚 **Other Free 3D Model Sites**

If Sketchfab doesn't have what you need:

- **Poly Pizza**: https://poly.pizza (Google Poly archive)
- **Free3D**: https://free3d.com
- **TurboSquid Free**: https://www.turbosquid.com/Search/3D-Models/free
- **CGTrader Free**: https://www.cgtrader.com/free-3d-models

---

**Ready to try it?** Just follow the steps above! 🚀
