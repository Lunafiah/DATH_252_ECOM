# Replace Astronaut with Sofa 3D Model - Guide

## 🎯 Goal

Replace the test astronaut model with an actual sofa 3D model for "The Emerald Velvet Sofa" product.

---

## ✅ **Option 1: AI-Generated Model (Using Your Pipeline)**

### Step 1: Download Sofa Image

```powershell
# Navigate to pipeline directory
cd server/ai-3d-pipeline

# Create output directories
mkdir output
mkdir output\images
mkdir output\models

# Download the sofa image
python -c "import requests; r = requests.get('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070'); open('input/sofa.jpg', 'wb').write(r.content)"
```

### Step 2: Run Background Removal

```powershell
python remove_background.py input/sofa.jpg output/images/sofa_nobg.png
```

**Expected**: Creates `output/images/sofa_nobg.png` with transparent background

### Step 3: Generate 3D Model

```powershell
python generate_3d.py output/images/sofa_nobg.png output/models/sofa.glb
```

**Note**:

- First run downloads ~4GB AI model
- Takes 30-60 seconds
- Requires 6GB+ GPU VRAM

### Step 4: Copy to Public Folder

```powershell
# Copy GLB to public models folder
copy output\models\sofa.glb ..\..\public\models\sofa.glb
```

### Step 5: Update Database

```powershell
# Go back to server directory
cd ..

# Run update script
node update-product-3d.js
```

Then edit the script to use local path:

```javascript
model3D: {
  glb: "/models/sofa.glb",
  usdz: "/models/sofa.usdz"  // Optional
}
```

---

## ✅ **Option 2: Download Pre-Made Model (Recommended - Faster & Better Quality)**

### Step 1: Find Free Sofa Model

Go to **Sketchfab**: https://sketchfab.com/search?features=downloadable&licenses=322a749bcfa841b29dff1e8a1bb74b0b&q=sofa&type=models

**Good free models:**

- "Velvet Sofa" by various artists
- Filter: **Downloadable** + **CC License**

### Step 2: Download GLB File

1. Click on a sofa model
2. Click **Download 3D Model**
3. Select **glTF Binary (.glb)** format
4. Download (usually 2-10MB)

### Step 3: Copy to Project

```powershell
# Copy downloaded file to public folder
copy Downloads\sofa.glb public\models\sofa.glb
```

### Step 4: Update Database

Run this in your server terminal:

```powershell
cd server
node update-product-3d.js
```

Make sure the script updates product ID 1 with:

```javascript
model3D: {
  glb: "/models/sofa.glb";
}
```

---

## 🔧 **Update Database Script**

Edit `server/update-product-3d.js`:

```javascript
const result = await Product.findOneAndUpdate(
  { id: 1 },
  {
    $set: {
      model3D: {
        glb: "/models/sofa.glb", // Local path, not URL
        usdz: "/models/sofa.usdz", // Optional for iOS AR
      },
    },
  },
  { new: true }
);
```

---

## 🎨 **Verify It Works**

### Step 1: Refresh Browser

```
http://localhost:3000/product/1
```

### Step 2: Scroll Down

You should see the sofa 3D model instead of the astronaut!

### Step 3: Test Interactions

- ✅ **Drag** to rotate
- ✅ **Scroll** to zoom
- ✅ **AR button** on mobile

---

## 📊 **Comparison**

| Method                 | Time    | Quality | Difficulty |
| ---------------------- | ------- | ------- | ---------- |
| **AI Pipeline**        | 2-3 min | Medium  | Hard       |
| **Sketchfab Download** | 30 sec  | High    | Easy       |

**Recommendation**: Use **Sketchfab** for better quality and faster results!

---

## 🐛 **Troubleshooting**

### Model doesn't show up

1. Check browser console (F12) for errors
2. Verify file exists: `public/models/sofa.glb`
3. Check database has correct path
4. Refresh page (Ctrl+F5)

### Model is too big/small

Edit `Product3DViewer.jsx`:

```javascript
<model-viewer
  camera-orbit="0deg 75deg 2m"  // Adjust last value for zoom
  min-camera-orbit="auto auto 1m"
  max-camera-orbit="auto auto 5m"
  ...
>
```

### Model is rotated wrong

Add `orientation` attribute:

```javascript
<model-viewer
  orientation="0deg 0deg 0deg"
  ...
>
```

---

## ✅ **Next Steps**

1. Choose Option 1 (AI) or Option 2 (Download)
2. Get sofa 3D model
3. Copy to `public/models/sofa.glb`
4. Update database
5. Refresh browser
6. Enjoy your sofa in 3D! 🛋️
