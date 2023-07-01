window.addEventListener('load', () => {
   if(isLoggedIn()){
     alert("You are alerady logged in");
     window.location.href='/Shop';
   }
 });
 

const login = async () => {
   event.preventDefault();
   const email = document.getElementById("email").value;
   const password = document.getElementById("password").value; 

   let users = await JSON.parse(localStorage.getItem("users"));
   console.log(users);
   if(!users) {
    alert("Please register first");
    return;
   } 
   let user = users.filter(element => {
        return element.email = email;
   });
   console.log(user);
   if(!user) {
    alert("Please register first");
    // window.location.href = '/Login'
    return;
   }
   console.log(user[0].password, password);
   if(user[0].password !== password) {
    alert("Please enter correct password");
    return;
   }
   localStorage.setItem("currentUser", JSON.stringify(user[0]));
   window.location.href = "/Shop";
}

const isLoggedIn = () => {
   return !!localStorage.getItem("currentUser");
}