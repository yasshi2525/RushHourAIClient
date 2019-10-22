
function main() {
    Logger.log("start");
    RushHour.users.forEach(user => {
        RushHour.loginOrSignUp(user);
    });
    Logger.log("end");
}