import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
    const { repos } = React.useContext(GithubContext);
    const languages = repos.reduce((total, item) => {
        const { language, stargazers_count } = item;
        if (!language)
            // do nothing
            return total;
        if (!total[language])
            total[language] = { value: 1, stars: stargazers_count };
        else {
            total[language] = {
                ...total[language],
                value: total[language].value + 1,
                stars: total[language].stars + stargazers_count
            };
        }
        return total;
    }, {});
    const languageData = [];
    const starData = [];
    for (const key in languages) {
        languageData.push({
            label: key,
            value: languages[key].value.toString(),
        });
        starData.push({
          label: key,
          value: languages[key].stars.toString(),
        });
    }
    languageData.sort((a, b) => b.value - a.value).slice(0, 5); // top 5
    starData.sort((a, b) => b.stars - a.stars).slice(0, 5);

    let {stars, forks} = repos.reduce((total, item)=>{ // only record one repo with the same stars
      const {name, stargazers_count, forks} = item;
      total.stars[stargazers_count] = {label: name, value: stargazers_count};
      total.forks[forks] = {label: name, value: forks};
      return total;
    }, {stars: {}, forks: {}});

    const repoData = Object.values(stars).slice(-5).reverse();
    const forkData = Object.values(forks).slice(-5).reverse();

    return (
        <section className="section">
            <Wrapper className="section-center">
                <Pie3D data={languageData} />
                <Column3D data={repoData}/>
                <Doughnut2D data={starData} />
                <Bar3D data={forkData}/>
            </Wrapper>
        </section>
    );
};

const Wrapper = styled.div`
    display: grid;
    justify-items: center;
    gap: 2rem;
    @media (min-width: 800px) {
        grid-template-columns: 1fr 1fr;
    }

    @media (min-width: 1200px) {
        grid-template-columns: 2fr 3fr;
    }
    div {
        width: 100% !important;
    }
    .fusioncharts-container {
        width: 100% !important;
    }
    svg {
        width: 100% !important;
        border-radius: var(--radius) !important;
    }
`;

export default Repos;
