import React, { Component } from 'react';
import { Icon, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import PopUpAddBoard from './../common/PopUpAddBoard'
import { PlaceholderImageRectangular } from './../loaders/'
class BoardsMainContentContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            privateBoards: null,
            teams: null,
            isOpenPrivate: false,
            isOpenTeam: null,
            isUpdated: false,
        }
        this.handleOpenPrivate = this.handleOpenPrivate.bind(this);
        this.handleClosePrivate = this.handleClosePrivate.bind(this);
        this.toggleUpdate = this.toggleUpdate.bind(this);
        this.handleOpenTeam = this.handleOpenTeam.bind(this);
        this.handleCloseTeam = this.handleCloseTeam.bind(this);
    }
    toggleUpdate() {
        this.setState({ isUpdated: !this.state.isUpdated })
    }
    async saveTeams() {
        const url = 'https://trello-clone-backend-bnd7.onrender.com/api/task'
        const { jwttoken } = localStorage
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/JSON',
                    Authorization: `Token ${jwttoken}`
                }
            })
            const data = await response.json()
            if (!data.errors) {
                const teams = data.teams;
                this.setState({ teams }, () => {
                    const map = new Map();
                    teams.forEach(team => {
                        map.set(team._id, false);
                    })
                    this.setState({ isOpenTeam: map })
                })
            }
        } catch (error) {
            console.error('Error: ' + error)
        }
    }
    async savePrivateBoards() {
        const url = 'https://trello-clone-mern.herokuapp.com/api/boards/private'
        const { jwttoken } = localStorage
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/JSON',
                    Authorization: `Token ${jwttoken}`
                }
            })
            const data = await response.json()
            if (!data.errors) {
                const privateBoards = data.boards;
                this.setState({ privateBoards })
            }
        } catch (error) {
            console.error('Error: ' + error)
        }
    }

    handleOpenPrivate() {
        this.setState({ isOpenPrivate: true });
    }
    handleClosePrivate() {
        this.setState({ isOpenPrivate: false });
    }

    handleOpenTeam(event) {

        const id = event.target.closest('div').dataset.teamId;
        const newMap = new Map(this.state.isOpenTeam);
        newMap.set(id, true);
        this.setState({ isOpenTeam: newMap });
    }
    handleCloseTeam() {
        const newMap = new Map(this.state.isOpenTeam);
        let arr = Array.from(newMap.keys());
        arr = arr.map(elem => [elem, false]);
        const isOpenTeam = new Map(arr);
        this.setState({ isOpenTeam });
    }
    componentDidMount() {
        this.savePrivateBoards();
        this.saveTeams();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.isUpdated !== this.state.isUpdated) {
            this.savePrivateBoards();
            this.saveTeams();
        }
    }
    render() {
        const { privateBoards, teams, isOpenPrivate, isOpenTeam } = this.state;
        return (
            <div className="content-all-boards">

                {

                    privateBoards ? (
                        <div className="boards-page-board-section">
                            <div className="boards-page-board-section-header">
                                <Icon name='lock' size='large'>

                                </Icon>
                                <h2>
                                    Private Boards
                                </h2>

                            </div>
                            <div>
                                <ul className="boards-page-board-section-list">
                                    {privateBoards && privateBoards.map(board => {
                                        return (
                                            <li className="boards-page-board-section-list-item" key={board.slug}>
                                                <Link
                                                    to={'/b/' + board.slug}
                                                    style={{
                                                        background: `url(${board.image})`,
                                                        backgroundPosition: 'center',
                                                        backgroundSize: 'cover',
                                                        backgroundRepeat: 'no-repeat'
                                                    }}
                                                    className='board-tile'>
                                                    <span className='board-tile-fade'></span>
                                                    <div className='board-tile-details'>
                                                        <div title={board.name} dir="auto"
                                                            className="board-tile-details-name">
                                                            <p className='board-title-name' >
                                                                {board.name}
                                                            </p>

                                                        </div>
                                                        <div className="board-tile-details-sub-container">
                                                            <span className="board-tile-options">
                                                                <span
                                                                    title="Click to star this board. It will show up at the top of your boards list."
                                                                    className="board-tile-options-star-icon">
                                                                    <Icon name="star outline" />
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                    <li className="boards-page-board-section-list-item">
                                        <div
                                            style={{
                                                backgroundColor: '#F0F2F4',

                                            }}
                                            className='board-tile'>
                                            <div className='board-tile-details'>

                                                <Popup
                                                    basic
                                                    on="click"
                                                    open={isOpenPrivate}
                                                    onOpen={this.handleOpenPrivate}
                                                    style={{
                                                        position: "fixed",
                                                        minWidth: "100vw",
                                                        minHeight: "100vh",
                                                        top: -2,
                                                        left: -2,
                                                        bottom: -2,
                                                        right: -2,
                                                        transform: "none",
                                                        marginTop: 0,
                                                        backgroundColor: "rgba(0,0,0,0.5)",
                                                    }}
                                                    trigger={<div title="Create new private board"
                                                        className="board-new-tile-div">
                                                        <p className='board-new-tile' >
                                                            Create New Board
                                                    </p>

                                                    </div>}>
                                                    <PopUpAddBoard
                                                        handleClose={this.handleClosePrivate}
                                                        toggleUpdate={this.toggleUpdate}

                                                    />
                                                </Popup>
                                            </div>

                                        </div>
                                    </li>


                                </ul>
                            </div>
                        </div>
                    ) : (PlaceholderImageRectangular(2))
                }
                {
                    teams ? (isOpenTeam && teams.map(team => {
                        return (
                            <div className="boards-page-board-section" key={team.slug}>
                                <div className="boards-page-board-section-header">
                                    <Icon name='users' size='large'>

                                    </Icon>
                                    <h2>
                                        {team.name}
                                    </h2>

                                </div>
                                <div>
                                    <ul className="boards-page-board-section-list">
                                        {team.boards && team.boards.map(board => {
                                            return (
                                                <li className="boards-page-board-section-list-item" key={board.slug}>
                                                    <Link
                                                        to={'/b/' + board.slug}
                                                        style={{
                                                            background: `url(${board.image})`,
                                                            backgroundPosition: 'center',
                                                            backgroundSize: 'cover',
                                                            backgroundRepeat: 'no-repeat'
                                                        }}
                                                        className='board-tile'>
                                                        <span className='board-tile-fade'></span>
                                                        <div className='board-tile-details'>
                                                            <div title="New SDEs" dir="auto"
                                                                className="board-tile-details-name">
                                                                <p className='board-title-name' >
                                                                    {board.name}
                                                                </p>

                                                            </div>
                                                            <div className="board-tile-details-sub-container">
                                                                <span className="board-tile-options">
                                                                    <span
                                                                        title="Click to star this board. It will show up at the top of your boards list."
                                                                        className="board-tile-options-star-icon">
                                                                        <Icon name="star outline" />
                                                                    </span>

                                                                </span>

                                                            </div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                        <li className="boards-page-board-section-list-item">
                                            <div
                                                style={{
                                                    backgroundColor: '#F0F2F4',

                                                }}
                                                className='board-tile'>
                                                <div className='board-tile-details'>

                                                    <Popup
                                                        basic
                                                        on="click"
                                                        open={isOpenTeam.get(team._id)}
                                                        onOpen={this.handleOpenTeam}
                                                        style={{
                                                            position: "fixed",
                                                            minWidth: "100vw",
                                                            minHeight: "100vh",
                                                            top: -2,
                                                            left: -2,
                                                            bottom: -2,
                                                            right: -2,
                                                            transform: "none",
                                                            marginTop: 0,
                                                            backgroundColor: "rgba(0,0,0,0.5)",
                                                        }}
                                                        trigger={
                                                            <div title="Create new team board"
                                                                className="board-new-tile-div" data-team-id={team._id}>
                                                                <p className='board-new-tile' >
                                                                    Create New Board
                                                                </p>

                                                            </div>
                                                        }>
                                                        <PopUpAddBoard

                                                            handleClose={this.handleCloseTeam}
                                                            toggleUpdate={this.toggleUpdate}
                                                            teamId={team._id}
                                                        />
                                                    </Popup>
                                                </div>

                                            </div>
                                        </li>


                                    </ul>
                                </div>
                            </div>
                        )
                    })) : (PlaceholderImageRectangular(3))
                }

            </div >)
    }
}

export default BoardsMainContentContainer