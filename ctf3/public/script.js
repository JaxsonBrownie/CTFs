// Show current date/time on page load
document.getElementById("datetime").textContent = "Current Time: " + new Date().toLocaleString();




// Function to change the background color
function changeBackground() {
    const colors = ["#f9c74f", "#90be6d", "#f94144", "#000000", "#ffffff"];

    let index = Math.floor(Math.random() * colors.length);
    console.log(index);
    const randomColor = colors[index];
    
    document.body.style.backgroundColor = randomColor;
}




// Execute this flag to get the fourth flag
function getFlag() {
  const _ = [
    () => String.fromCharCode(67),
    () => String.fromCharCode(84), 
    () => String.fromCharCode(70), 
    () => String.fromCharCode(123), 
    () => [102, 111, 117, 114, 116, 104].map(c => String.fromCharCode(c)).join(''),
    () => String.fromCharCode(95), 
    () => [102, 108, 97, 103].map(c => String.fromCharCode(c)).join(''),
    () => String.fromCharCode(125) 
  ];

  const flag = _[0]() + _[1]() + _[2]() + _[3]() + _[4]() + _[5]() + _[6]() + _[7]();
  console.log("Flag:", flag);
};
