module.exports = function Vote(opBody) {
    
    Object.assign(this, opBody);
    
    this.isMine = function (userid) {
        return userid == this.voter;
    }
    
    this.isCommentMine = function (userid) {
        return userid == this.author;
    }

}
