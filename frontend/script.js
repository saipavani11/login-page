
document.addEventListener('DOMContentLoaded',function(){
    let loginbtn = document.getElementById("login-btn");

    let signupbtn = document.getElementById("sign-up-btn");
    let heading = document.getElementById("heading");
    let otherDetails = document.getElementById("other-details");

    signupbtn.addEventListener("click",function(){
        heading.innerHTML = "Sign Up!" ;
        loginbtn.innerHTML = "sign up";
        otherDetails.remove();
    })

    const loggerpage = document.getElementById("loggerpage");
    const container = document.getElementById("container");

    const UserDiv = document.createElement("div");
    const Userpara = document.createElement("p");
    const UserToken = document.createElement("p");
    const logoutbtn = document.createElement("button");
    
    const userDetails = {
        add: function(username,token){
            loggerpage.remove();
            otherDetails.remove();

            heading.innerHTML = "User Details";


            UserDiv.setAttribute("id", "user-Div");
            Userpara.setAttribute("id", "user-para");
            UserToken.setAttribute("id", "user-token");
            logoutbtn.setAttribute("id", "logout");
            // logoutbtn.setAttribute("class", "btn-layout");

            logoutbtn.innerHTML = "logout";
            Userpara.innerHTML = `username : ${username}`;
            UserToken.innerHTML = `token : ${token}`;

            UserDiv.append(Userpara);
            UserDiv.append(UserToken);
            UserDiv.append(logoutbtn);

            container.append(UserDiv);            
        } 
    }

    loginbtn.addEventListener("click", async function(){
        
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        if(loginbtn.innerHTML === "sign up"){
            try{
                await axios.post("http://localhost:3004/signup",{
                    username: username,
                    password: password
                });
                alert("you are signed up!");
    
                heading.innerHTML = "Sign In!" ;
                loginbtn.innerHTML = "sign in";
            }catch(error){
                console.error("Sign-up error", error);
                alert("Sign-up failed. Please try again.");
            }

        }else if(loginbtn.innerHTML === "sign in"){
            console.log("button-clicked signin");
            try{
                const response = await axios.post("http://localhost:3004/signin",{
                    username : username,
                    password: password
                });
                
                console.log("helooooo");
                console.log("response : ",response);
                
                if(response.data.token){
                    localStorage.setItem("token",response.data.token);
                    alert("you are signed in!");
                    
                    const meresponse = await axios.get("http://localhost:3004/me",{
                        headers : {
                            "token" : response.data.token
                        }
                    });
                    userDetails.add(meresponse.data.username, meresponse.data.token);

                }else{
                    alert("invalid credentals");
                }
            }catch(error){
                console.error("error during signining in",error);
                alert("user not signed up!");
            }
        }
    });


    const homepage = document.createElement("div");
    const homeContent = document.createElement("p");

    logoutbtn.addEventListener("click", function(){
        UserDiv.remove();
        
        homeContent.setAttribute("id", "home-cont");
        homepage.setAttribute("id", "home-page");

        homeContent.innerHTML = "refresh page to sign-in";
        homepage.append(homeContent);
        container.append(homepage);
       

    });
});