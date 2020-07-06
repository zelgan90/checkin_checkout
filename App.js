/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Container, Content, Header, Body, Title, Input, Button } from 'native-base';
import SLIIcon from 'react-native-vector-icons/dist/SimpleLineIcons'

export default class App extends Component
{
  constructor(props)
  {
    super(props)

    this.state =
    {
      employeeCode: '',
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
      this.setError('NO_CODE')
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
      this.setError(error.message)
    })
  }

  onClearDatePress()
  {
    this.setState({ response: [], employeeCode: '' })
  }

  setError(errorMessage)
  {
    switch(errorMessage)
    {
      case 'NO_CODE':
      {
        this.setState({ error: 'Please enter a code.' })
        break
      }
      case 'ERROR_SERVIDOR':
      {
        this.setState({ error: 'An error has occurred in the server. Please try again later.'})
        break
      }
      case 'SIN_INFORMACION':
      {
        this.setState({ error: 'There is no data available for the entered code.'})
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
      <View style={ styles.itemContainer } key={item.registryInternalKey.toString()}>
        
        <View style={ styles.idContainer }>
          <Text style={ styles.id }>{`${item.id}`}</Text>
        </View>

        <View style={ styles.dateStatusContainer }>
          <Text><Text style={ styles.label }>Date: </Text>{`${item.date}`}</Text>
          {
            item.shouldDisplayStatus ?
            <Text><Text style={ styles.label }>Status: </Text>{`${item.status}`}</Text>
            :
            null
          }
        </View>

        <View style={ styles.iconContainer }>
          <SLIIcon name={item.type === 'clock in' ? 'login' : 'logout'} size={30}/>
        </View>
      </View>
    )
  }

  render()
  {
    return (
      <Container>
        <Header style={ styles.header } androidStatusBarColor='#F8F8F8'>
          <StatusBar barStyle={"dark-content"} />
          <Body style={ styles.body }>
            <Title style={ styles.title }>iTex</Title>
          </Body>
        </Header>
        <Content style={ styles.content }>
            <View style={ styles.form }>
              <Text style={ styles.inputLabel }>Enter your employee code:</Text>
              <Input
                style={ styles.input }
                value={this.state.employeeCode}
                onChangeText={ (employeeCode) => this.updateEmployeeCode(employeeCode) }
                returnKeyType="go"
                onSubmitEditing={() => { this.onCheckDataPress() }}
              />
            </View>

            {
              this.state.error &&
              <View style={ styles.errorContainer }>
                <Text style={ styles.error }>{this.state.error}</Text>
              </View>
              ||
              null
            }

            <View style={ styles.greetingContainer }>
              {this.state.employeeCode && <Text style={ styles.greeting }>Hello employee {this.state.employeeCode}!</Text> || null}
              <View
                style={ styles.verticalLine }
              />
            </View>

            <View>
              <Button style={ styles.button }
              onPress={ () => this.onCheckDataPress() }
              >
                <Text style={ styles.buttonLabel }>Check data</Text>
              </Button>
            </View>

            {
              this.state.response.length > 0 ?
              <TouchableOpacity onPress={() => { this.onClearDatePress() }} style={ styles.clearButton }>
               <Text style={ styles.clearButtonLabel }>Clear data</Text>
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

const styles = StyleSheet.create(
{
  header:
  {
    backgroundColor: '#F8F8F8'
  },
  body:
  {
    alignItems: 'center'
  },
  title:
  {
    color: 'black',
    fontWeight: 'bold'
  },
  content:
  {
    paddingHorizontal : 15,
    marginTop: 15
  },
  form:
  {
    marginVertical: 10
  },
  inputLabel:
  {
    color: 'gray'
  },
  input:
  {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'lightgray',
    paddingVertical: 5,
    marginVertical: 5
  },
  errorContainer:
  {
    alignContent: 'center',
    alignItems: 'center'
  },
  error:
  {
    color: 'red',
    textAlign: 'center'
  },
  greetingContainer:
  {
    alignContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  verticalLine:
  {
    borderBottomColor: '#BBBBBB',
    borderBottomWidth: 1,
    width: 100,
    margin: 10
  },
  greeting:
  {
    color: '#BBBBBB'
  },
  button:
  {
    backgroundColor: '#307CF6',
    alignSelf:'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20
  },
  buttonLabel:
  {
    color: 'white'
  },
  clearButton:
  {
    alignItems: 'flex-end'
  },
  clearButtonLabel:
  {
    color: 'gray'
  },
  itemContainer:
  {
    borderColor: '#64B9F1',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-around',
    paddingVertical: 10
  },
  idContainer:
  {
    justifyContent: 'center',
    alignItems: 'center'
  },
  id:
  {
    fontWeight: 'bold',
    fontSize: 20
  },
  dateStatusContainer:
  {
    justifyContent: 'center'
  },
  label:
  {
    fontWeight: 'bold'
  },
  iconContainer:
  {
    justifyContent: 'center',
    alignItems: 'center'
  },



})