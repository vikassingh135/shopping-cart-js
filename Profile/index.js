
window.addEventListener('load', async () => {
  if(!isLoggedIn()){
    alert('Please login first');
    window.location.href='/shopping-cart-js/Login'
  }

  const currentUser = await JSON.parse(localStorage.getItem("currentUser"));
  document.getElementById('fName').value = currentUser.fname;
  document.getElementById('lName').value = currentUser.lname; 
})

const saveInfo = async () => {
  const users = await JSON.parse(localStorage.getItem("users"));
  const currentUser = await JSON.parse(localStorage.getItem("currentUser"));

  event.preventDefault();
  let userId;
  users.forEach((element, id) => {
    if (element.email === currentUser.email) {
      userId = id;
    }
  });

  const fname = document.getElementById("fName").value;
  const lname = document.getElementById("lName").value;

  let newUser = { ...currentUser, fname, lname };
  users.splice(userId, 1, newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(newUser));
  alert("Information Saved Successfully");
};

const changePassword = async () => {
    const users = await JSON.parse(localStorage.getItem("users"));
    const currentUser = await JSON.parse(localStorage.getItem("currentUser"));
  
    event.preventDefault();
    let userId;
    users.forEach((element, id) => {
      if (element.email === currentUser.email) {
        userId = id;
      }
    });
  
    const oldPassword = document.getElementById("old-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
  
    if(oldPassword !== currentUser.password){
        alert("Old Password Does not match");
        return;
    }

    if(newPassword !== confirmPassword) {
        alert("Confirm Password Does not Match");
        return;
    }

    let newUser = { ...currentUser, password: newPassword };
    users.splice(userId, 1, newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    alert("Password Changed Successfully");
  };
  
const logout = () => {
    event.preventDefault();
    localStorage.removeItem("currentUser");
    window.location.href = '/shopping-cart-js/Login';
}

const isLoggedIn = () => {
  return !!localStorage.getItem("currentUser");
}