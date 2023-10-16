import React from 'react';
import ChatBot from "react-simple-chatbot";
import { Segment } from 'semantic-ui-react';

const ChatGpt = () => {
    const steps = [
        {
            id:'Greet',
            message: 'Chào mừng bạn đến với shop Đình Minh',
            trigger: 'Ask Name'
        },
        {
            id:'Ask Name',
            message:'Nhập tin nhắn',
            trigger:'waiting1'
        },
        {
            id:'waiting1',
            user:true,
            trigger:'Name'
        },
        {
            id: 'Name',
            message:'{previousValue}',
            trigger:'issues'
        },
        {
            id: 'issues',
            options: [
                {value:"React", label: "React", trigger: "React"},
                {value:"Nodejs", label: "Nodejs", trigger: "Nodejs"},
            ]
        },
        {
            id:'React',
            message:"Cảm ơn bạn đã nói vấn đề phản ứng của bạn",
            end:true
        },
        {
            id:'Nodejs',
            message:"Cảm ơn bạn đã nói vấn đề Nodejs của bạn",
            end:true
        }
    ]

    return (
        <Segment floated="right">
            <ChatBot steps={steps} />
        </Segment>
    )
}

export default ChatGpt;
