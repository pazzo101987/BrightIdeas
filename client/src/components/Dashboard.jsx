import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import withAuth from './WithAuth'
import { toast } from 'react-toastify';


const Dashboard = (props) => {
    const { count, setCount, user, welcome, darkMode } = props
    const [ideaList, setIdeaList] = useState([])
    const [oneIdea, setOneIdea] = useState({ idea: "" })
    const [errors, setErrors] = useState({})
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const toastAdded = () => toast.success(`➕ You added an idea`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });
    const toastFav = (id) => toast.success(`👍 You favorited an idea`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });
    const toastUnfav = (id) => toast.error(`👎 You unfavorited an idea`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });
    const toastDelete = (id) => toast.error(`🗑 You deleted ${id}`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/ideas`)
            .then(res => {
                const sortedIdeas = res.data.idea.sort((a, b) => b.favoritedBy.length - a.favoritedBy.length);
                setIdeaList(sortedIdeas)
                // setIdeaList(res.data.idea)
            })
            .catch(err => console.log(err))
        // sort()
        // eslint-disable-next-line
    }, [count]);

    const changeHandler = (e) => {
        setOneIdea({
            ...oneIdea,
            [e.target.name]: e.target.value
        })
    }

    const submitHandler = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/ideas', oneIdea, { withCredentials: true })
            .then(res => {
                setIdeaList([...ideaList, res.data.idea])
                toastAdded()
                setOneIdea({
                    idea: "",
                })
                setErrors({
                    idea: "",
                })

            })
            .catch(err => {
                console.log(`submit errer`, err)
                setErrors({
                    idea: err.response.data.error.errors.idea,
                })
                console.log(errors)
            })
    }

    const favoriteIdea = (idea) => {
        axios.post(`http://localhost:8000/api/ideas/${idea._id}/favorite`, {}, { withCredentials: true })
            .then(res => {
                setCount(count + 1)
                toastFav(idea.idea)
            })
            .catch(err => console.log(`FAV error`, err))
    }

    const unfavoriteIdea = (idea) => {
        axios.post(`http://localhost:8000/api/ideas/${idea._id}/unfavorite`, {}, { withCredentials: true })
            .then(res => {
                setCount(count + 1)
                toastUnfav(idea.idea)
            })
            .catch(err => console.log(`UNfav error`, err))
    }

    const removeIdea = (idea) => {
        axios.delete(`http://localhost:8000/api/ideas/${idea._id}`)
            .then(res => {
                setCount(count + 1)
                toastDelete(idea.idea)
            })
            .catch(err => console.log(err))
    }

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    return (
        <div>
            <h1 style={{ marginTop: "75px" }}>Welcome to Bright Ideas</h1>
            <div className={"mainDivLight"}>
                <div className={"col-sm-8 mx-auto"}>
                    {windowWidth > 575 ?
                        (<form className="mx-auto mt-5" onSubmit={submitHandler}>
                            {oneIdea.idea && oneIdea.idea?.length < 2 ? <p className="text-danger">Idea must be at least 2 characters</p> : null}
                            {errors.idea ? <p className="text-danger">{errors.idea.message}</p> : null}
                            <div className="input-group col-10">
                                <div className="form-floating">
                                    <input type="text" className="form-control" name="idea" value={oneIdea.idea} onChange={changeHandler} placeholder='Add a new idea!' />
                                    <label className="darkText" htmlFor="idea">Add a new idea!</label>
                                </div>
                                <button type="submit" className="input-group-text btn btn-success" onSubmit={submitHandler}>Add idea!</button>
                            </div>
                        </form>) :
                        (<form className={"mx-auto mt-5"} onSubmit={submitHandler}>
                            {oneIdea.idea && oneIdea.idea?.length < 2 ? <p className="text-danger">Idea must be at least 2 characters</p> : null}
                            {errors.idea ? <p className="text-danger">{errors.idea.message}</p> : null}
                            <div className="form-floating col-10 mx-auto">
                                <input type="text" className="form-control" name="idea" value={oneIdea.idea} onChange={changeHandler} placeholder='Add a new idea!' />
                                <label className="darkText" htmlFor="idea">Add a new idea!</label>
                            </div>
                            <button type="submit" className="input-group-text btn btn-success mt-3 col-10" onSubmit={submitHandler}>Add idea!</button>
                        </form>)}
                </div>
                <h3 className='mt-3'>All Ideas</h3>
                <div className='col-8 mx-auto text-start ideaList'>
                    {ideaList.map((idea, index) => {
                        return (

                            <div className='mt-5' key={idea._id}>
                                {
                                    idea?.addedBy ?
                                        <><span>On {new Date(idea.createdAt).toLocaleString("en-US", options)} at {new Date(idea.createdAt).toLocaleString([], { timeStyle: 'short' })}, </span><Link to={`/users/${idea.addedBy.alias}`}>{idea?.addedBy.name}</Link><span> said:</span>&nbsp;</> :
                                        <span>Deleted User says: </span>
                                }
                                <br className="MQHide" />
                                <p className="idea" style={{ border: "1px solid", padding: "5px 10px" }}>{idea.idea}</p>
                                <span className='text-end'>
                                    {
                                        ideaList[index].favoritedBy.length === 0 ?
                                            null :
                                            ideaList[index].favoritedBy.length === 1 ?
                                                <><span>Liked by </span><Link to={`/ideas/${idea._id}`}>{ideaList[index].favoritedBy.length}</Link><span> user  </span></> :
                                                <><span>Liked by </span><Link to={`/ideas/${idea._id}`}>{ideaList[index].favoritedBy.length}</Link><span> users  </span></>
                                    }
                                </span>
                                <br className='MQHide' />
                                { // fav/unfav
                                    ideaList[index].favoritedBy.some(ideaObj => ideaObj._id === user?._id) ? (
                                        <button className="btn btn-danger" onClick={() => unfavoriteIdea(idea)}>✩</button>
                                    ) : (
                                        <button className="btn btn-success" onClick={() => favoriteIdea(idea)}>★</button>
                                    )}

                                { // delete if logged in user or 'admin' email user
                                    (welcome === (`${idea?.addedBy?.name} (@${idea?.addedBy?.alias})`) || user?.email === "t@w.com") ? <><button className={"btn btn-dark"} onClick={() => removeIdea(idea)}>🅧</button>&nbsp;&nbsp;</> : null
                                }
                            </div>
                        )
                    })}
                    <br /><br /><br />
                </div>
            </div>
        </div >
    )
}

export default withAuth(Dashboard)
