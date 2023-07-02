window.addEventListener('load', () => {
  if(isLoggedIn()){
    alert("You are alerady logged in");
    window.location.href='/shopping-cart-js/Shop';
  }
});

const signup = async () => {
  const fname = document.getElementById("fName").value;
  const lname = document.getElementById("lName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  event.preventDefault();
  if (!(fname && lname && email && password && confirmPassword)) {
    alert("All Fields Are Required");
  }
  if (password !== confirmPassword) {
    alert("Password does not match");
  }

  let currentUser = {
    fname,
    lname,
    email,
    password,
    accessToken: generateAccessToken()
  };

  let users = await JSON.parse(localStorage.getItem("users"));

  console.log(users);
  if (users && users.length > 0) {
    let userExist = users.filter((element) => {
      return element.email === currentUser.email;
    });
    console.log(userExist);
    if (userExist && userExist.length>0) {
      alert("User already exist");
      return;
    }
  } else users = [];
  users.push(currentUser);
  
  localStorage.setItem("users", JSON.stringify(users));
  alert("Sign up successful, Please Login");
  window.location.href="/shopping-cart-js/Login"
};

const generateAccessToken = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};


const isLoggedIn = () => {
   return !!localStorage.getItem("currentUser");
}