import React,{Component,Fragment} from 'react';
import TodoItem from './TodoItem';
import {Button,Input,Icon,Row,Col} from 'antd';
import './TodoList.css'
// 定义一个react组件 继承Component  组件里必须有一个函数render
//负责组件要显示的内容

class TodoList extends Component{
  //面向数据编程
  constructor(props){
    super(props);
    this.state={
      //存放数据
      list:[],
      inputTitle:'',
      inputContent:'',
    }
    //改变this指向
    this.handlerInputTitleChange = this.handlerInputTitleChange.bind(this);
    this.handlerInputContentChange = this.handlerInputContentChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handerDelete = this.handerDelete.bind(this);
    this.hasDone = this.hasDone.bind(this);
    this.edit = this.edit.bind(this);
  }

  componentDidMount(){
    //组件被挂载的时候 在这里提取localStroge里的数据

        var list = getStorageList("todolist");
        if(list && list.length>0){
          // 更新组件的list
         this.setState({
           list,
         });
        }
   
  }

  componentWillUnmont(){
        //组件的卸载(Mounting)阶段
  }

  handleBtnClick(){
    //这里的this  ==>btn 在调用的时候要注意this对象的指向
    //不能直接调用list 要用react提供的方法
    //检查输入框是否为空
    if(this.state.inputTitle===''){
      return ;
    }
    //初始化一个itemMsg,将其放入list
    var item = new ItemMsg(this.state.inputTitle,this.state.inputContent);
    //这是一个json数组  应该是JSON对象
    var list = [JSON.parse(JSON.stringify(item)),...this.state.list];
    // console.log("list",list.toString);
    this.setState(
      {
        list:list, //当数据发生变化的时候，render函数会执行，重新渲染页面
        inputTitle:'',
        inputContent:'',
      }
    );
    saveItemList('todolist',list);
  }

  handlerInputTitleChange(e){
    this.setState({
      inputTitle: e.target.value
    });
    // console.log(e.target.value);
  }

  //文本框的值发生改变 获取值
  handlerInputContentChange(e){
    this.setState({
      inputContent: e.target.value
    });
  }

  //删除任务
  handerDelete(index){
    const list =[...this.state.list];
    list.splice(index,1);

    //在react里要改变state里的数据尽量不要直接修改，而是使用react里的方法 方便调试
    this.setState({
    //  ES6 语法 list: list 键和值一样 可以写做 list
      list
    })
    saveItemList('todolist',list);
  }

  //更改任务的内容
  edit(str,index){
    const list = [...this.state.list];
    list[index].content = str;
    this.setState(
      list,
    )
    saveItemList('todolist',list);
  }

  //标记任务是否完成
  hasDone(index,hasDone){
    const list =[...this.state.list]; //拷贝数组
    list[index].hasDone=hasDone;

    this.setState({
      list
    });
    saveItemList('todolist',list);
  }

  //渲染list列表
  getTodoItems(){
    return(
      this.state.list.map((item,index)=>{
            return (
              <TodoItem 
              delete={this.handerDelete}
              key={index} 
              content={item} 
              index={index}
              hasDone={this.hasDone}
              edit = {this.edit}
              />
            );
      })
    )
  }


  //父组件通过属性的形式来传递参数给子组件
  //子组件通过props接受父组件传递过来的参数
  render(){
    //  {/* onClick react绑定事件 */}
    const { TextArea } = Input;
    return(  //这里只能返回一个jsx
      <Fragment >
        <div className="TodoList font-color" >
          <div style={{fontSize:"30px",height:"40px",lineHeight:'40px',marginBottom:'10px'}}>ToDo-List</div>
          <Row gutter={4}>
                        <Col className="gutter-row" span={18} offset={2}>
                          <Row style={{marginLeft:'8px'}}>
                            <Col span={24}>
                            <Input addonBefore={<Icon type="pushpin" theme="twoTone" twoToneColor="#AC8DAF" rotate="10"/>} placeholder="title" value={this.state.inputTitle}  onChange={this.handlerInputTitleChange}/>
                            </Col>
                            <Col span={24}>
                            <TextArea row={3}  placeholder="content"  value={this.state.inputContent} onChange={this.handlerInputContentChange}/>
                            </Col>
                          </Row>
                        </Col>
                        <Col className="gutter-row" span={2}>
                        <Button  style={{borderColor:'#484c7F',color:'#484c7F',display:"block",margin:'25px 10px'}} type="primary" shape="round" ghost onClick={this.handleBtnClick}>add</Button>
                        </Col>
          </Row>
          {this.getTodoItems()}
        </div>

      </Fragment>
    );
  }

}

//封装一个任务类 
class ItemMsg {
  constructor(title,content,hasDone) {
      this.title = title;
      this.hasDone = hasDone||false;
      this.content = content;
  }
  setContent(content){
      this.content = content;
  }
  setDone(hasDone){
      this.hasDone = hasDone;
  }
}

//保存任务到localStorage
function saveItemList(key,list)
{
  if(list instanceof Array && list.length>0){
    if(window.localStorage){
      var itemlist=[];
       for(let i=0;i<list.length;i++){
          itemlist.push(JSON.stringify(list[i]));
       };
       window.localStorage.setItem(key,itemlist);
    }
  }

}

// 从localStorage中获取任务列表
function getStorageList(key){
  if(window.localStorage){
    var storage = window.localStorage;
    if(storage.getItem(key)){
        var list=storage.getItem(key).split("},");
        var jsonObj=null;  //初始化一个json对象
        var itemList=[];
        for(var i=0;i<list.length-1;i++){
          list[i]=list[i]+'}';
          jsonObj = JSON.parse(list[i]); //将字符串转为json对象
          itemList.push(jsonObj);//把json对象放到list中
        }
        jsonObj = JSON.parse(list[i]); //将字符串转为json对象
        itemList.push(jsonObj);//把json对象放到数组里
        return itemList;
    }
  }
}


export default TodoList;  //导出之后，才能导入 配对使用
