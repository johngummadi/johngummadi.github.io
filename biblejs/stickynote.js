var captured = null;
var highestZ = 0;
var highestId = 0;

function Note(addTimeStamp)
{
    var self = this;

    var note = document.createElement('div');
    note.className = 'note';
    note.addEventListener('mousedown', function(e) { return self.onMouseDown(e) }, false);
    note.addEventListener('click', function() { return self.onNoteClick() }, false);
    this.note = note;

    var close = document.createElement('div');
    close.className = 'closebutton';
    close.addEventListener('click', function(event) { return self.close(event) }, false);
    note.appendChild(close);

    var edit = document.createElement('div');
    //edit.className = 'edit';
    edit.setAttribute('contenteditable', false);
    edit.addEventListener('keyup', function() { return self.onKeyUp() }, false);
    note.appendChild(edit);
    this.editField = edit;
    
    //note.style.autoScroll = "true";
    //note.style.overflow = "auto";

    document.body.appendChild(note);
    return this;
}

Note.prototype = {
    get id()
    {
        if (!("_id" in this))
            this._id = 0;
        return this._id;
    },

    set id(x)
    {
        this._id = x;
    },

    get text()
    {
        return this.editField.innerHTML;
    },

    set text(x)
    {
        this.editField.innerHTML = x;
    },

    get left()
    {
        return this.note.style.left;
    },

    set left(x)
    {
        this.note.style.left = x;
    },

    get top()
    {
        return this.note.style.top;
    },

    set top(x)
    {
        this.note.style.top = x;
    },
    
    get width()
    {
        return this.note.style.width;
    },
    
    get height()
    {
        return this.note.style.height;
    },

    set width(x)
    {
        this.note.style.width = x;
    },
    
    set height(x)
    {
        this.note.style.height = x;
    },

    get zIndex()
    {
        return this.note.style.zIndex;
    },

    set zIndex(x)
    {
        this.note.style.zIndex = x;
    },

    close: function(event)
    {
        var note = this;
        var duration = event.shiftKey ? 2 : .25;
        this.note.style.webkitTransition = '-webkit-transform ' + duration + 's ease-in, opacity ' + duration + 's ease-in';
        //this.note.offsetTop; // Force style recalc
        this.note.style.webkitTransformOrigin = "0 0";
        this.note.style.webkitTransform = 'skew(30deg, 0deg) scale(0)';
        this.note.style.opacity = '0';

        var self = this;
        setTimeout(function() { document.body.removeChild(self.note) }, duration * 1000);
    },

    onMouseDown: function(e)
    {
        //captured = this; //Commenting this disables moving the sticky.
        this.startX = e.clientX - this.note.offsetLeft;
        this.startY = e.clientY - this.note.offsetTop;
        this.zIndex = ++highestZ;

        var self = this;
        if (!("mouseMoveHandler" in this)) {
            this.mouseMoveHandler = function(e) { return self.onMouseMove(e) }
            this.mouseUpHandler = function(e) { return self.onMouseUp(e) }
        }

        document.addEventListener('mousemove', this.mouseMoveHandler, true);
        document.addEventListener('mouseup', this.mouseUpHandler, true);

        return false;
    },

    onMouseMove: function(e)
    {
        if (this != captured)
            return true;

        this.left = e.clientX - this.startX + 'px';
        this.top = e.clientY - this.startY + 'px';
        return false;
    },

    onMouseUp: function(e)
    {
        document.removeEventListener('mousemove', this.mouseMoveHandler, true);
        document.removeEventListener('mouseup', this.mouseUpHandler, true);

        this.save();
        return false;
    },

    onNoteClick: function(e)
    {
        this.editField.focus();
        getSelection().collapseToEnd();
    },

    onKeyUp: function()
    {
        this.dirty = true;
    },
}

function loaded()
{
    loadNotes();
}

function loadNotes()
{
}

function newNote(left, top, width, height, text)
{
    var note = new Note(false);
    note.id = ++highestId;
    //note.timestamp = new Date().getTime();
    note.left = left + 'px';
    note.top = top + 'px';
    note.width = width + "px";
    note.height = height + "px";
    note.zIndex = ++highestZ;
    note.text = text;
}


