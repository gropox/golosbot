module.exports = function Comment(opBody) {
    
    Object.assign(this, opBody);
    
    this.isRoot = function() {
        return !this.parent_author || "" == this.parent_author;
    }
    
    this.isMine = function (userid) {
        return userid == this.author;
    }
    
    this.isParentMine = function (userid) {
        return userid == this.parent_author;
    }
        
    this.getRoot = function getPermlinkFromComment() {
        console.log("get root! [" + this.parent_author);
        console.log("get root! [" + this.permlink);
        if(this.isRoot()) {
            console.log("the root!");
            return "/@" + this.author + "/" + this.permlink;
        }

        let permpath = this.permlink.split("re-");
        console.log(JSON.stringify(permpath));
        if(permpath.length < 2) {
            return "";
        }
        let root = permpath[permpath.length-1];
        //remove timestamp
        root = root.replace(/-[0-9]{8}t[0-9]{6}.*z$/, "");
        let parts = root.match(/^([^\-]+)-(.*)/);
        //console.log(JSON.stringify(parts));
        
        return "/@" + parts[1] + "/" + parts[2];
    }
}
