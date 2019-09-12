import React from 'react';
import { Checkbox,Row, Col,Icon,Divider, message ,Popconfirm} from 'antd';
import './TodoItem.css'

//{this.props.content} 通过属性的形式接受来自父组件传递的参数

class TodoItem extends React.Component{
    constructor(props){
        super(props);
        this.handleDetele = this.handleDetele.bind(this);
        this.onChange = this.onChange.bind(this);
        this.callback = this.callback.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }
    //子组件与父组件通信，需要子组件调用父组件的方法
    //删除功能 子组件向父组件传值 
    handleDetele(){
        //const {delete,index}=this.props; 也可以使用结构赋值 这里的delete为保留的关键字 所以不能这样写
        //使用父组件的传递的delete参数指向的函数  传递当前的index
        this.props.delete(this.props.index);
        message.success('删除'+this.props.content.title+" 任务");
    }

    handleEdit(){
        var str = prompt("请修改content");
        if(str){
            this.props.edit(str,this.props.index);
        }
    }


     onChange= e => {
        console.log(`checked = ${e.target.checked}`);
        this.props.hasDone(this.props.index,e.target.checked);
      }

      callback(index) {
        console.log(index);
      }
    render(){
        const { content }=this.props; //结构赋值
        var itemDecorate='gutter-row TodoItem';
        var checked = false;
        if(content.hasDone){
            itemDecorate +=" line-through";
            checked=true;
        }
        console.log(this.props.index,checked);
        return (
            <div className="gutter-example">
                    <Row gutter={2}>
                        <Col className="gutter-row" span={2}>
                            <Checkbox id={'checkbox'+content.title} onChange={this.onChange} checked={checked} style={{color:'#484c7F',margin:"30px 0"}}></Checkbox>
                        </Col>
                        <Col className={itemDecorate} span={18}>
                            <p className="item">title: {content.title}</p>
                            <Divider dashed  style={{margin:'2px 0'}}/>
                            <p className="item">content：{content.content}</p>
                        </Col>
                        <Col className="gutter-row" span={1}>
                             <Icon type="edit"  onClick={this.handleEdit} style={{fontSize:'20px',margin:"30px 0"}}/>
                        </Col>
                        <Col className="gutter-row" span={1}>
                            <Popconfirm
                            title="Are you sure delete this task?"
                            onConfirm={this.handleDetele}
                            okText="Yes"
                            cancelText="No"
                              >
                                <Icon type="delete" style={{fontSize:'20px',margin:"30px 0"}} />
                            </Popconfirm> 
                        </Col>
                    </Row>
            </div>
        )
    }
}

//导出组件
export default TodoItem;
