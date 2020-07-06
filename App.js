/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Container, Content, Header, Body, Title, Input, Button } from 'native-base';
import SLIIcon from 'react-native-vector-icons/dist/SimpleLineIcons'

export default class App extends Component
{
  constructor(props)
  {
    super(props)

    this.state =
    {
      employeeCode: '1',
      response: [],
      error: '',
    };
  }

  updateEmployeeCode(employeeCode)
  {
    if (/^\d+$/.test(employeeCode) || employeeCode === '' )
    {
      this.setState({employeeCode, error: '' }) 
    }
  }

  onCheckDataPress()
  {
    const { employeeCode } = this.state

    if(employeeCode === '')
    {
      this.renderError('NO_ID')
      return false
    }

    this.setState({ error: '', response: [] })

    fetch(`https://us-central1-app-tiendita.cloudfunctions.net/simpleExerciseTest?id=${employeeCode}`)
    .then( response =>
    {
      if(!response.ok)
      {
        throw new Error('ERROR_SERVIDOR')
      }

      return response.json()
    })
    .then((responseJSON) =>
    {
      if(responseJSON.length === 0)
      {
        throw new Error('SIN_INFORMACION')
      }
      console.log(responseJSON)
      this.setState({ response: responseJSON[0] })
    })
    .catch((error) =>
    {
      console.log(error.message)

      this.renderError(error.message)
    })
  }

  onClearDatePress()
  {
    this.setState({ response: [], employeeCode: '' })
  }

  renderError(errorMessage)
  {
    switch(errorMessage)
    {
      case 'NO_ID':
      {
        this.setState({ error: 'Please enter an ID.' })
        break
      }
      case 'ERROR_SERVIDOR':
      {
        this.setState({ error: 'An error has occurred in the server. Please try again later.'})
        break
      }
      case 'SIN_INFORMACION':
      {
        this.setState({ error: 'There is no data available for the ID entered.'})
        break
      }
      default:
      {
        this.setState({ error: 'An error has occurred in the server. Please try again later.'})
      }
    }
  }

  renderItem(item)
  {
    if(!item.shouldDisplay)
    {
      return null
    }

    return (
      <View style={{ borderColor: '#64B9F1', borderWidth: 1, borderRadius: 5, flexDirection: 'row', marginVertical: 10, justifyContent: 'space-around', paddingVertical: 10 }} key={item.registryInternalKey.toString()}>
        
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20}}>{`${item.id}`}</Text>
        </View>

        <View style={{ justifyContent: 'center' }}>
          <Text><Text style={{ fontWeight: 'bold' }}>Date: </Text>{`${item.date}`}</Text>
          {
            item.shouldDisplayStatus ?
            <Text><Text style={{ fontWeight: 'bold' }}>Status: </Text>{`${item.status}`}</Text>
            :
            null
          }
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <SLIIcon name={item.type === 'clock in' ? 'login' : 'logout'} size={30}/>
        </View>
      </View>
    )
  }

  render()
  {
    return (
      <Container>
        <Header style={{ backgroundColor: '#F8F8F8' }} androidStatusBarColor='#F8F8F8'>
          <Body style={{ alignItems: 'center' }}>
            <Title style={{ color: 'black', fontWeight: 'bold' }}>iTex</Title>
          </Body>
        </Header>
        <Content style={{ paddingHorizontal : 15}}>
          <View style={{ marginVertical: 10 }}>
            <Text>Enter your employee code:</Text>
            <Input
              style={{ borderWidth: 1, borderRadius: 2, borderColor: 'lightgray', paddingVertical: 5, marginVertical: 5 }}
              value={this.state.employeeCode}
              onChangeText={ (employeeCode) => this.updateEmployeeCode(employeeCode) }
              returnKeyType="go"
              onSubmitEditing={() => { this.onCheckDataPress() }}
            />
          </View>

          {
            this.state.error &&
            <View style={{ alignContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'red', textAlign: 'center' }}>{this.state.error}</Text>
            </View>
            ||
            null
          }

          <View style={{ alignContent: 'center', alignItems: 'center', marginVertical: 10 }}>
            {this.state.employeeCode && <Text style={{ color: '#BBBBBB' }}>Hello employee {this.state.employeeCode}!</Text> || null}
            <View
              style={{
                borderBottomColor: '#BBBBBB',
                borderBottomWidth: 1,
                width: 100,
                margin: 10
              }}
            />
          </View>

          <View>
            <Button style={{ backgroundColor: '#307CF6', alignSelf:'center', paddingHorizontal: 10, borderRadius: 5, marginBottom: 20 }}
            onPress={ () => this.onCheckDataPress() }
            >
              <Text style={{ color: 'white'}}>Check data</Text>
            </Button>
          </View>

          {
            this.state.response.length > 0 ?
            <TouchableOpacity onPress={() => { this.onClearDatePress() }} style={{ justifyContent: 'felx-end', backgroundColor: 'red' }}>
             <Text>Clear data</Text>
            </TouchableOpacity>
            :
            null
          }

          <FlatList
            data={this.state.response}
            showsVerticalScrollIndicator={ false }
            renderItem={( { item } ) => this.renderItem(item) }
          />
        </Content>
      </Container>
    );
  }
}