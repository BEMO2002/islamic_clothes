
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');
const debugDiv = document.getElementById('debug');

const canvasWidth = 550;
const canvasHeight = 550;
canvas.width = canvasWidth;
canvas.height = canvasHeight;


const backpackImage = new Image();
backpackImage.src = '/Assets/home/make your.png'; 

let uploadedImage = null;


backpackImage.onload = function() {
    drawBackpack();
};

function drawBackpack() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.drawImage(backpackImage, 0, 0, canvasWidth, canvasHeight);

    if (uploadedImage) {
        const imageX = 170;  // إحداثي X للمنطقة البيضاء
        const imageY = 150;  // إحداثي Y للمنطقة البيضاء
        const imageWidth = 220;  // عرض المنطقة البيضاء
        const imageHeight = 250; // ارتفاع المنطقة البيضاء
        const borderRadius = 30; // قيمة border-radius لتتناسب مع شكل المنطقة البيضاء
        const borderRadiusTop = 110; // قيمة border-radius لتتناسب مع شكل المنطقة البيضاء
        ctx.save();

        ctx.beginPath();
        ctx.moveTo(imageX + borderRadiusTop, imageY);
        // الزاوية العلوية اليمنى (top-right)
        ctx.lineTo(imageX + imageWidth - borderRadiusTop, imageY);
        ctx.arcTo(imageX + imageWidth, imageY, imageX + imageWidth, imageY + borderRadiusTop, borderRadiusTop);
        // الزاوية السفلية اليمنى (bottom-right)
        ctx.lineTo(imageX + imageWidth, imageY + imageHeight - borderRadius);
        ctx.arcTo(imageX + imageWidth, imageY + imageHeight, imageX + imageWidth - borderRadius, imageY + imageHeight, borderRadius);
        // الزاوية السفلية اليسرى (bottom-left)
        ctx.lineTo(imageX + borderRadius, imageY + imageHeight);
        ctx.arcTo(imageX, imageY + imageHeight, imageX, imageY + imageHeight - borderRadius, borderRadius);
        // الزاوية العلوية اليسرى (top-left) مرة أخرى لإغلاق المسار
        ctx.lineTo(imageX, imageY + borderRadiusTop);
        ctx.arcTo(imageX, imageY, imageX + borderRadiusTop, imageY, borderRadiusTop);

        ctx.closePath();

        ctx.clip();
        ctx.drawImage(uploadedImage, imageX, imageY, imageWidth, imageHeight);

        ctx.restore();

        debugDiv.innerText = "Image Drawn Successfully";
    }
}
imageInput.addEventListener('change', function(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
        if (files.length > 1) {
            debugDiv.innerText = "You Can Upload Only one photo";
            return;
        }

        // استخدام الصورة الأولى فقط (يمكن تعديل هذا لاحقًا)
        const file = files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImage = new Image();
            uploadedImage.src = e.target.result;
            uploadedImage.onload = function() {
                debugDiv.innerText = "Image Uploaded Sucessfully";
                drawBackpack(); // إعادة رسم الشنطة مع الصورة المرفوعة
            };
            uploadedImage.onerror = function() {
                debugDiv.innerText = "Something Went Wrong";
            };
        };
        reader.onerror = function() {
            debugDiv.innerText = "Faild To Read the Photo";
        };
        reader.readAsDataURL(file);
    } else {
        debugDiv.innerText = "No image choossen";
    }
});


















