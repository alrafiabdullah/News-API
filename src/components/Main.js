import React, { Component } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "../components/main.css";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: "",
      totalResult: 0,
      articleList: [],
      offset: 0,
      data: [],
      perPage: 10,
      currentPage: 0,
    };

    this.getNews = this.getNews.bind(this);
  }

  componentDidMount() {
    const api = axios.create({
      baseURL:
        "https://geolocation-db.com/json/1a811210-241d-11eb-b7a9-293dae7a95e1",
    });
    api
      .get()
      .then((res) =>
        this.setState({
          country: res.data.country_name,
        })
      )
      .catch(function (error) {
        console.error(error);
      });
  }

  getNews(country) {
    axios
      .get(
        `https://newsapi.org/v2/everything?domains=bdnews24.com&apiKey=adca92286f084c7ca8c3b6230a542d98`
      )
      .then((res) => {
        console.log(res.data);
        const data = res.data.articles;
        const slice = data.slice(
          this.state.offset,
          this.state.offset + this.state.perPage
        );

        this.setState({
          totalResult: res.data.articles.length,
          articleList: slice,
          pageCount: Math.ceil(data.length / this.state.perPage),
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.getNews();
      }
    );
  };

  render() {
    return (
      <div className="container jumbotron">
        <h5>Hello World!</h5>
        <p>
          You are from <strong>{this.state.country}</strong>.
        </p>
        <p>
          Check the news from <strong>{this.state.country}</strong> here!
        </p>
        <Button onClick={() => this.getNews(this.state.country)}>
          Get News
        </Button>
        <div className="alert alert-success mt-3 mb-3">
          Total Results: {this.state.totalResult}
        </div>
        <div className="row">
          {this.state.articleList.map((news) => {
            return (
              <div key={news.id} className="col-sm-6">
                <div className="card mb-3">
                  <div className="card-header">
                    {news.title}
                    <br />
                    Source: <strong>{news.source.name}</strong>
                  </div>
                  <div className="card-text">
                    <p className="description">{news.description}</p>
                    <br />
                    <img src={news.urlToImage} alt={news.title} />
                    <br />
                    <a
                      href={news.url}
                      className="btn btn-info mt-3 mb-3"
                      target="_blank"
                      rel="noreferrer"
                    >
                      News Link
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <ReactPaginate
          previousLabel={"prev"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      </div>
    );
  }
}

export default Main;
