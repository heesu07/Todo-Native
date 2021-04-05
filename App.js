import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {Platform, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components/native';
import Constants from 'expo-constants';
import lodash from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import produce from 'immer';

const Container = styled.SafeAreaView`
  padding-top: ${Constants.statusBarHeight}px;
  flex: 1;
`;
const KeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1;
`;
const Content = styled.ScrollView`
  flex: 1;
  padding : 8px 24px;
`;
const TodoItem = styled.View`
  flex-direction: row;
  margin: 1px;
  align-items: center;
`;
const TodoItemText = styled.Text`
  flex: 1;
  font-size: 20px;
`;
const TodoItemButton = styled.Button``;

const InputContainer = styled.View`
  flex-direction: row;
  padding : 8px 24px;
`;
const Input = styled.TextInput`
  flex: 1
`;
const TempText = styled.Text`
  font-size: 20px;
  margin-bottom:12px;
`;
const SendBtn = styled.Button``;
const Check = styled.TouchableOpacity`
  margin-right: 4px;
`;
const CheckIcon = styled.Text`
  font-size: 20px;
`;


export default function App() {
  let [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  //const todoRef = useRef();
  React.useEffect( () => {
    AsyncStorage.getItem('todos')
    .then(data =>{
      if(data !== null)
        setTodos(JSON.parse(data));
    })
    .catch(error => {
      alert(error.message);
    });
  },[]);

  const store = (newTodos) =>{
    setTodos(newTodos);
    AsyncStorage.setItem('todos', JSON.stringify(newTodos))
    .catch(e => {
      alert(e.message);
    });
  };

  const updateTodos = (e) =>{
    e.preventDefault();      
    if(newTodo === '') return;      
    const newTodos = [...todos, {
      id:Date.now(), 
      title: newTodo,
      done: false
    }];
    store(newTodos);
    
    setNewTodo('');
    console.log(todos);
  };
  const deleteTodo = (id)=>{
    const newTodos = todos.filter(item => item.id !== id);
    store(newTodos);
  };
  const toggleCheck = (item) =>{
    const newTodos = todos.map(todo => {
      if(todo.id === item.id){
        const done = !item.done;
        return {...item, done: done};
      };
      return todo;
    }); 
    store(newTodos);
  };

  // 리턴 할 수 있는 값: 컴포턴트, 컴포넌트로 만들어진 배열
  return (
    <Container>
      <KeyboardAvoidingView
        behavior={ Platform.OS == "ios" ? "padding" : "height"}
      >
        <Content>          
            {
              todos && todos.map(todo => {
                return (            
                  <TodoItem key={todo.id}>   
                    <Check onPress={()=>{
                      store(produce(todos, draft =>{
                        const index = todos.indexOf(todo);
                        draft[index].done = !todos[index].done;
                      }));
                    }}>
                      <CheckIcon >
                          {todo.done ? '☑' : '☐'}</CheckIcon>                      
                    </Check>                  
                    <TodoItemText>{todo.title}</TodoItemText>
                    <TodoItemButton title="Delete" onPress={()=>deleteTodo(todo.id)}></TodoItemButton>
                  </TodoItem>
                )
              })
            }
          
        </Content>

        <InputContainer>
          <Input value={newTodo} type='text' onChangeText={setNewTodo}></Input>
          <SendBtn title='Add Todo' onPress={updateTodos}></SendBtn>
        </InputContainer>
        
      </KeyboardAvoidingView>
    </Container>
  );
}


