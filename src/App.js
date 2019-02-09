import React, { Component } from 'react'
import http from './services/httpService'
import { ToastContainer } from 'react-toastify'
import config from './config.json'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

class App extends Component {
  state = {
    jokes: []
  }

  async componentDidMount () {
    const { data: jokes } = await http.get(config.apiEndpoint)
    this.setState({ jokes })
  }

  handleRefresh = async () => {
    const { data: jokes } = await http.get(config.apiEndpoint)
    this.setState({ jokes })
  }

  handleAdd = async () => {
    const jokeObj = {
      setup: 'Added new joke',
      punchline: 'Added new punchline'
    }
    const { data: joke } = await http.post(config.apiEndpoint, jokeObj)
    const jokes = [joke, ...this.state.jokes]
    this.setState({ jokes })
  }

  handleUpdate = async joke => {
    joke.setup = 'UPDATED'
    await http.put(config.apiEndpoint + '/' + joke.id, joke)
    const jokes = [...this.state.jokes]
    const index = jokes.indexOf(joke)
    jokes[index] = { ...jokes }
    this.setState({ joke })
  }

  handleDelete = async joke => {
    const originalJokes = this.state.jokes

    const jokes = this.state.jokes.filter(j => j.id !== joke.id)
    this.setState({ jokes })

    try {
      await http.delete(config.apiEndpoint + '/' + joke.id)
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        alert('This joke has already been deleted.')
      }

      this.setState({ jokes: originalJokes })
    }
  }

  render () {
    return (
      <React.Fragment>
        <ToastContainer />
        <div className='jumbotron'>
          <h1 className='display-4'>Random Joke Generator</h1>
          <p>
            Sorry, but I had to deactivate the add, update and delete buttons
            because the API does not allow for any calls outside of GET. I was
            testing this with the JSON Placeholder API and it works. Enjoy the
            corny programming jokes!
          </p>
          <button className='btn btn-dark btn-lg' onClick={this.handleRefresh}>
            More Jokes
          </button>
        </div>
        <button className='btn btn-primary' disabled onClick={this.handleAdd}>
          Add
        </button>
        <table className='table'>
          <thead>
            <tr>
              <th>Setup</th>
              <th>Punchline</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.jokes.map(joke => (
              <tr key={joke.id}>
                <td>{joke.setup}</td>
                <td>{joke.punchline}</td>
                <td>
                  <button
                    disabled
                    className='btn btn-info btn-sm'
                    onClick={() => this.handleUpdate(joke)}>
                    Update
                  </button>
                </td>
                <td>
                  <button
                    disabled
                    className='btn btn-danger btn-sm'
                    onClick={() => this.handleDelete(joke)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    )
  }
}

export default App
