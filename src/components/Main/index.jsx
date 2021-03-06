// importamos react
import React, { Component } from 'react';

// instalamos e implementamos la libreria uuid para manejar los id de arrays en React
import uuid from 'uuid';
// importamos el comp MessageList
import MessageList from '../MessageList';
// importamos el InputText
import InputText from '../InputText';

import ProfileBar from '../ProfileBar';

class Main extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: Object.assign({}, this.props.user, {retweets: []}, {favorites: []}),
      onOpenText: false,
      usernameToReply: '',
      messages: [{
        id: uuid.v4(),
        text: 'Mensaje de prueba',
        picture: 'https://lh3.googleusercontent.com/-GQ4rWC32tIo/AAAAAAAAAAI/AAAAAAAAAAA/AFiYof3L-nRM0FkfofJ4W_B0YCGfLqvBMg/s32-c-mo/photo.jpg',
        displayName: 'Hugo H. Lazarte',
        username: 'hugoglazarte',
        date: Date.now(),
        retweets: 0,
        favorites: 0
      },
      {
        id: uuid.v4(),
        text: 'Mensaje de prueba',
        picture: 'https://lh3.googleusercontent.com/-GQ4rWC32tIo/AAAAAAAAAAI/AAAAAAAAAAA/AFiYof3L-nRM0FkfofJ4W_B0YCGfLqvBMg/s32-c-mo/photo.jpg',
        displayName: 'Hugo H. Lazarte',
        username: 'hugoglazarte',
        date: Date.now() - 1800000,
        retweets: 0,
        favorites: 0
      }]
    }

    // Otra forma de bindear mas elegante
     this.handleSendText = this.handleSendText.bind(this)

     this.handleRetweet = this.handleRetweet.bind(this)
     this.handleFavorite = this.handleFavorite.bind(this)
     this.handleReplyTweet = this.handleReplyTweet.bind(this)
  }

  handleSendText(event){
    event.preventDefault()
    let newMessage = {
      id: uuid.v4(),
      username: this.props.user.email.split('@')[0],
      displayName: this.props.user.displayName,
      picture: this.props.user.photoURL,
      date: Date.now(),
      // con event.target agarramos el form y con .text.value el contenido del campo name=text
      text: event.target.text.value
    }

    this.setState({
      // METODO ANTIGUO Q MODIFICA EL ORIGINAL:
      // messages: messages.push(newMessage)

      // Metodo Nuevo q crea un nuevo objeto sin mod el original:
      messages: this.state.messages.concat([newMessage]),
      openText: false
    })
    // console.log(newMessage)
  }

  handleCloseText(event){
    event.preventDefault()
    this.setState({ openText: false })
  }

  handleOpenText(event) {
    // cuando una funcion recibe un evento, lo primero es anular el que estaba por defecto con preventDefault
    event.preventDefault()
    this.setState({ openText: true })
  }

  // estas funciones llegan desde message a traves de messagelist y creamos un handle ya que
  //    el atributo que queremos modificar se encuentra en este componente.
  handleRetweet(msgId) {
    let alreadyRetweeted = this.state.user.retweets.filter(rt => rt === msgId)

    if(alreadyRetweeted.length === 0) {
      let messages = this.state.messages.map(msg => {
        if(msg.id === msgId) {
          msg.retweets++
        }
        return msg
      })

      let user = Object.assign({}, this.state.user)
      user.retweets.push(msgId)

      this.setState({
        messages,
        user
      })
    }

  }

  handleFavorite(msgId) {
    // primero vemos si ya le dimos fav
    let alreadyFavorited = this.state.user.favorites.filter(fav => fav === msgId)

    if(alreadyFavorited.length === 0){
      let messages = this.state.messages.map(msg => {
        if(msg.id === msgId) {
          msg.favorites++
        }
        return msg
      })

      let user = Object.assign({}, this.state.user)
      user.favorites.push(msgId)

      this.setState({
        messages: messages,
        user: user
      })
    }
  }


  handleReplyTweet(msgId, usernameToReply) {
    this.setState({
      openText: true,
      usernameToReply: usernameToReply
    })

  }


  // render va a ejecutar la func renderOpenText y si OpenText es true va a mostrar el input
  renderOpenText(){
    if(this.state.openText) {
      // abajo mostramos dos formas de hecer el bind, una no muestra el bind por que se declaro mas arriba
      return (
        <InputText
          onSendText={this.handleSendText}
          onCloseText={this.handleCloseText.bind(this)}
          usernameToReply={this.state.usernameToReply}
        />
      )
    }
  }

  render(){
    // los mensajes los vamos a mostrar y manejar por el nuevo comp. MessageList
    //  ***** username={ this.props.user.email.split('@')[0] } ***** Agarramos la primera parte del email

    //*** onOpenText={ this.handleOpenText.bind(this) } ****
    // como handleOpenText se dispara desde el onclick fuera de este componente
    //   tenemos un error de alcance, con bind(this) le indicamos que handelopentext se refiere al this de este componente
    return (
      <div>
        <ProfileBar
          picture={ this.props.user.photoURL }
          username={ this.props.user.email.split('@')[0] }
          onOpenText={this.handleOpenText.bind(this)}
        />
        {this.renderOpenText()}
        <MessageList
          messages={ this.state.messages }
          onRetweet={ this.handleRetweet }
          onFavorite={ this.handleFavorite }
          onReplyTweet={ this.handleReplyTweet }
        />
      </div>
    )
  }
}

export default Main
