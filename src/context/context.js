import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
    const [githubUser, setGithubUser] = useState(mockUser);
    const [repos, setRepos] = useState(mockRepos);
    const [followers, setFollowers] = useState(mockFollowers);
    // request loading
    const [requests, setRequests] = useState(0);
    const [loading, setLoading] = useState(false);
    // error
    const [error, setError] = useState({ show: false, msg: "" });
    // request github user
    const searchGithubUser = async (user) => {
        toggleError();
        setLoading(true);

        const response = await axios
            .get(`${rootUrl}/users/${user}`)
            .catch((err) => console.log(err));
        if (response) {
            setGithubUser(response.data);
            const { login, followers_url } = response.data;
            await Promise.allSettled([
                axios.get(`${rootUrl}/users/${login}/repos?per_page=100`), // repos
                axios.get(`${followers_url}?per_page=100`), // followers
            ]).then((results) => {
                const [repos, followers] = results;
                const status = "fulfilled";
                if(repos.status===status)
                    setRepos(repos.value.data);
                if(followers.status===status)
                    setFollowers(followers.value.data);
            }).catch((err)=>console.log(err));
        } else {
            toggleError(true, "there is no user with that name");
        } 
        checkRequests();
        setLoading(false);
    };

    // check rate
    const checkRequests = async () => {
        const { data } = await axios.get(`${rootUrl}/rate_limit`);
        let {
            rate: { remaining },
        } = data;
        setRequests(remaining);
        if (remaining === 0) {
            // throw an error
            toggleError(
                true,
                "sorry, you have exceeded your hourly rate limit!"
            );
        }
    };

    function toggleError(show = false, msg = "") {
        setError({ show, msg });
    }

    useEffect(() => {
        checkRequests();
    }, []);

    return (
        <GithubContext.Provider
            value={{
                githubUser,
                repos,
                followers,
                requests,
                error,
                loading,
                searchGithubUser,
            }}
        >
            {children}
        </GithubContext.Provider>
    );
};

export { GithubProvider, GithubContext };
