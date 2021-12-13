import React from 'react';
import './App.css';
import Select from 'react-select';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

class App extends React.Component {
    constructor(props) {
        super (props)
        this.state = {
            data: {},
            selectLang: "python",
            selectStmt: "for",
            newLang: "",
            newStmt: "",
            deleteLang: "",
            deleteStmt: "",
            key: "",
            comment: "",
            open: "",
            options: [],
        }
    }

    componentDidMount() {
        this.loadData()
        this.makeOptions()
    }

    async loadData() {
        const url = "http://133.242.158.143:8100/getdata"
        return fetch(url)
            .then((res) => res.json())
            .then((res) => this.setState({data: res}))
    }

    async postData() {
        const data = this.state.data
        const key = this.state.key
        const comment = this.state.comment
        const url = `http://133.242.158.143:8100/postdata?key=${key}&comment=${comment}`

        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "text/plain"},
            body: JSON.stringify(data)
        }

        return fetch(url, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "true") {
                    alert("OK")
                } else {
                    alert("Key is Incorrect")
                }
            })
    }

    makeOptions() {
        const words = [
            "python", "python3", "py", "java", "ja", "javascript", "js", "kotlin", "kt", "swift",
            "loop", "for", "while", "break", "continue", "if", "elif", "else", "in", "not", "and", "or", "try", "catch", "except", "error", "when", "case", "switch", "then", "comment", "out", "with", "open",
            "class", "def", "function", "func", "const", "let", "var", "val", "global", "local",
            "import", "from", "require",
            "list", "array", "mutable", "dict", "dictionary", "object", "obj", "set", "map", "tuple", "range",
            "chr", "character", "str", "string", "int", "integer", "long", "float", "double", "bool", "boolean", "true", "false", "date", "time",
            "console", "log", "print", "printf", "println", "reader", "read", "readline", "input", "stream", "join", "pow", "power", "minus", "plus", "round", "add", "append", "push", "concat", "unshift", "shift",  "delete", "pop", "remove", "removeAt", "slice", "filter", "reduce", "some", "every", "flat", "flatMap", "splice", "find", "findindex", "includes", "lastindex", "keys", "fill", "zfill", "round",  "enumerate", "isnull", "forEach", "isnumeric", "random", "randint", "ran", "len", "length", "size", "reverse", "reversed", "sort", "sorted", "shuffle", "shuffled", "format", "f", "replace", "type",
            "event", "mouse", "value", "key", "document", "window", "listener", "context", "position", "index", "url", "uri", "get", "set", "item", "file", "write", "read", "os", "system", "request", "response", "beautifulsoup", "soup", "subprocess",
            "echo", "cat", "do", "done", "sleep", 
        ]
        const options = []
        words.forEach(i => {
            options.push({value: i, label: i})
        })
        this.setState({options: options})
    }

    handleClickLang(lang) {
        const stmt = Object.keys(this.state.data[lang].statement)[0]
        this.setState({
            selectLang: lang,
            selectStmt: stmt
        })
    }

    handleClickStmt(stmt) {this.setState({selectStmt: stmt})}

    handleClickNewLang() {
        const data = this.state.data
        if (this.state.newLang === "") {return}
        else if (this.state.newLang in data) {return}

        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth() + 1
        const day = today.getDate()

        data[this.state.newLang] = {
            id: Object.keys(data).length,
            statement: {},
            update: `${year}-${month}-${day}`
        }

        this.setState({
            data: data,
            newLang: ""
        })

    }

    handleClickNewStmt() {
        const data = this.state.data
        if (this.state.newStmt === "") {return}
        else if (this.state.newStmt in data[this.state.selectLang].statement) {return}

        data[this.state.selectLang].statement[this.state.newStmt] = {
            code: "",
            sample: "",
            result: "",
            tag: []
        }
        this.setState({
            data: data,
            newStmt: ""
        })
    }

    handleClickDelete() {
        const data = this.state.data
        const lang = this.state.deleteLang
        const stmt = this.state.deleteStmt
        if (lang === "") {alert("Delete lang is not defined!!")}
        else if (!(lang in data)) {alert(`${lang} is not defined!!`)}
        else if (stmt === "") {
            delete data[lang]
            const selectLang = Object.keys(data)[0]
            const selectStmt = Object.keys(data[lang].statement)[0]
            this.setState({data: data, selectLang: selectLang, selectStmt: selectStmt})
            alert(`${lang} deleted!!`)
        }
        else if (!(stmt in data[lang].statement)) {alert(`${stmt} is not defined!!`)}
        else {
            delete data[lang].statement[stmt]
            const selectStmt = Object.keys(data[lang].statement)[0]
            this.setState({selectStmt: selectStmt, data: data})
            alert(`${lang} ${stmt} deleted!!`)
        }
    }

    handleChangeCode(e) {
        const data = this.state.data
        data[this.state.selectLang].statement[this.state.selectStmt].code = e.target.value
        this.setState({data: data})
    }

    handleChangeSample(e) {
        const data = this.state.data
        data[this.state.selectLang].statement[this.state.selectStmt].sample = e.target.value
        this.setState({data: data})
    }

    handleChangeResult(e) {
        const data = this.state.data
        data[this.state.selectLang].statement[this.state.selectStmt].result = e.target.value
        this.setState({data: data})
    }

    handleChangeTag(e) {
        const data = this.state.data
        const tag = []
        e.forEach(i => {tag.push(i.value)})
        data[this.state.selectLang].statement[this.state.selectStmt].tag = tag
        this.setState({data: data})
    }

    render() {
        return (
<div>

<div id="content">
    <div id="content_header" >
        <h2 id="title" className="title_view">data isert form</h2>
        <Button
            variant="contained"
            className="save_button"
            onClick={() => {this.postData.bind(this)()}} >
            send data
        </Button>
        <TextField
            className="save_button"
            id="key_input"
            label="password"
            type="password"
            variant="filled"
            value={this.state.key}
            onChange={e => {this.setState({key: e.target.value})}} />
        <TextField
            className="save_button"
            id="comment_input"
            label="comment"
            variant="filled"
            value={this.state.comment}
            onChange={e => {this.setState({comment: e.target.value})}} />
    </div>
    <div id="content_body">
        <div className="content_body_item" id="langs">
            <h2>langs</h2>
            <TextField
                className="new_text"
                id="input_newLang"
                label="newLang"
                variant="filled"
                value={this.state.newLang}
                onChange={e => {this.setState({newLang: e.target.value})}} />
            <IconButton aria-label="add" size="large" onClick={this.handleClickNewLang.bind(this)} >
                <AddIcon fontSize="inherit" className="add_Icon" />
            </IconButton>
            <ViewLang 
                data={this.state.data} 
                onClick={this.handleClickLang.bind(this)} 
                selectLang={this.state.selectLang} />
        </div>
        <div className="content_body_item" id="stmts">
            <h2>stmt</h2>
            <TextField
                className="new_text"
                id="input_newStmt"
                label="newStmt"
                variant="filled"
                value={this.state.newStmt}
                onChange={e => {this.setState({newStmt: e.target.value})}} />
            <IconButton aria-label="add" size="large" onClick={this.handleClickNewStmt.bind(this)} >
                <AddIcon fontSize="inherit" className="add_Icon" />
            </IconButton>
            <ViewStmt
                data={this.state.data}
                lang={this.state.selectLang}
                selectStmt={this.state.selectStmt}
                onClick={this.handleClickStmt.bind(this)} />
        </div>
        <div className="content_body_item" id="items" >
            <div id="view_items">
                <div className="item_title" >
                    <h2>{`${this.state.selectLang} -> ${this.state.selectStmt}`} </h2>
                </div>
                <div className="input_text">
                    <h3>code: </h3>
                    <TextField
                        className="text_field"
                        id="input_code"
                        label="Code"
                        multiline
                        maxRows={8}
                        value={(this.state.data[this.state.selectLang])? this.state.data[this.state.selectLang].statement[this.state.selectStmt].code : ""}
                        onChange={this.handleChangeCode.bind(this)}
                        variant="filled" />
                </div>
                <div className="input_text">
                    <h3>sample: </h3>
                    <TextField
                        className="text_field"
                        id="input_sample"
                        label="Sample"
                        multiline
                        maxRows={8}
                        value={(this.state.data[this.state.selectLang])? this.state.data[this.state.selectLang].statement[this.state.selectStmt].sample : ""}
                        onChange={this.handleChangeSample.bind(this)}
                        variant="filled" />
                </div>
                <div className="input_text">
                    <h3>result: </h3>
                    <TextField
                        className="text_field"
                        id="input_result"
                        label="result"
                        multiline
                        maxRows={8}
                        value={(this.state.data[this.state.selectLang])? this.state.data[this.state.selectLang].statement[this.state.selectStmt].result : ""}
                        onChange={this.handleChangeResult.bind(this)}
                        variant="filled" />
                </div>
                <div className="imput_select">
                    <h3>tag: </h3>
                    <Select
                        id="input_tag"
                        defaultValue={null}
                        isMulti
                        name="tag"
                        options={this.state.options}
                        value={(this.state.data[this.state.selectLang])? this.state.data[this.state.selectLang].statement[this.state.selectStmt].tag.map(i => {return {value: i, label: i}}): null}
                        onChange={this.handleChangeTag.bind(this)}
                        classNamePrefix="select" />
                </div>
            </div>
        </div>
    </div>
    <div id="content_footer">
        <Button
            variant="contained"
            className="save_button"
            color="error"
            onClick={() => {this.setState({open: true})}} >
            delete
        </Button>
        <Dialog
            open={this.state.open}
            onClose={() => {this.setState({open: false})}}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {`${this.state.deleteLang}-${this.state.deleteStmt}|| Delete Are you sure you want to?`}
            </DialogTitle>
            <DialogActions>
                <Button onClick={() => {
                    this.setState({open: false})
                    alert("Canceled it")
                }}>
                cancel
                </Button>
                <Button onClick={() => {
                    this.setState({open: false})
                    this.handleClickDelete.bind(this)()
                }} autoFocus>
                delete
                </Button>
            </DialogActions>
        </Dialog>
        <TextField
            className="save_button"
            id="delete_stmt"
            label="deleteStmt"
            variant="filled"
            value={this.state.deleteStmt}
            onChange={e => {this.setState({deleteStmt: e.target.value})}} />
        <TextField
            className="save_button"
            id="delete_lang"
            label="deleteLang"
            variant="filled"
            value={this.state.deleteLang}
            onChange={e => {this.setState({deleteLang: e.target.value})}} />
    </div>
</div>
</div>

        )
    }
}

const ViewLang = (props) => {
    if (Object.keys(props.data).length === 0){ return <div />}
    else {
        return Object.keys(props.data).map(lang => {
            if (lang === props.selectLang) {return (
                <div 
                    key={lang}
                    onClick={() => {props.onClick(lang)}} 
                    className="select" 
                    style={{backgroundColor: "blue"}} >
                    <h3>{lang}</h3>
                </div>
            )}
            else {return (
                <div 
                    key={lang}
                    onClick={() => {props.onClick(lang)}} 
                    className="select" >
                    <h3>{lang}</h3>
                </div>
            )}
        })
    }
}

const ViewStmt = (props) => {
    if (Object.keys(props.data).length === 0) { return <div /> }
    else {
        return Object.keys(props.data[props.lang].statement).map(stmt => {
            if (stmt === props.selectStmt) {return (
                <div 
                    key={stmt}
                    onClick={() => {props.onClick(stmt)}} 
                    className="select"
                    style={{backgroundColor:"blue"}} >
                    <h3>{stmt}</h3>
                </div>
            )}
            else {return (
                <div
                    key={stmt}
                    onClick={() => { props.onClick(stmt)}}
                    className="select" >
                    <h3>{stmt}</h3>
                </div>
            )}
        })
    }
}

export default App
