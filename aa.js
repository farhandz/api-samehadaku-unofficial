const mapUrl = "https://www.google.com/maps/place/VOB+vape+vapor+Pejaten+Ready+GO+SHOP/data=!4m7!3m6!1s0x2e69f21640cd53c1:0x7c9e4effe1213739!8m2!3d-6.2794608!4d106.8335729!16s%2Fg%2F11dxcj2d9b!19sChIJwVPNQBbyaS4ROTch4f9Onnw?authuser=0&hl=en&rclk=1";

// Extract latitude and longitude from the URL
const matches = mapUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);

if (matches && matches.length >= 3) {
  const latitude = parseFloat(matches[1]);
  const longitude = parseFloat(matches[2]);
  
  console.log("Latitude:", latitude);
  console.log("Longitude:", longitude);
} else {
  console.log("Latitude and longitude not found in the URL.");
}
