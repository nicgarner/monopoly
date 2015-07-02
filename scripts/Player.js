define("Player", function(){
    function Player(name, token) {
        this.name = name;
        this.token = token;
        this.space = 0;
    }

    return Player;
});