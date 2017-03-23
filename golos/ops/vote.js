module.exports = function Vote(opBody) {
    
    Object.assign(this, opBody);
    
    this.isMine = function (userid) {
        return userid == this.voter;
    }
    
    this.isCommentMine = function (userid) {
        return userid == this.author;
    }
    
    this.getRoot = function () {
        let thisRoot = "/@" + this.author + "/" + this.permlink;
        if(!(this.permlink.match(/^re-.*-[0-9t]z$/))) {
            return thisRoot;
        }

        let permpath = this.permlink.split("re-");
        if(permpath.length < 2) {
            return thisRoot;
        }
        let root = permpath[permpath.length-1];
        //remove timestamp
        root = root.replace(/-[0-9]{8}t[0-9]{6}.*z$/, "");
        let parts = root.match(/^([^\-]+)-(.*)/);
        
        return "/@" + parts[1] + "/" + parts[2];
    }

}
