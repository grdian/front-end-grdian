import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as API from "../../state/io/API";

class MainView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			loggedInUser: API.nullUser,
			grdians: API.nullGrdianList,
			alerts: API.nullAlertList
		};
	}

	componentDidMount() {
		const loggedInUserId = this.props.loggedInUser.id;
		console.log(loggedInUserId);

		if (loggedInUserId === undefined || loggedInUserId == -1) {
			this.props.history.push("/login");
		} else {
			let dataPromise = API.getSpecificGrdian(loggedInUserId);
			dataPromise.then(data => {
				this.setState({
					loggedInUser: data
				});
			});
		}

		fetch("http://localhost:8080/api/grdians/" + loggedInUserId)
			.then(res => res.json())
			.then(
				result => {
					this.setState({
						isLoaded: true,
						grdians: result
					});
				},
				error => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			);

		fetch("http://localhost:8080/api/activealerts/" + loggedInUserId)
			.then(res => res.json())
			.then(
				result => {
					this.setState({
						isLoaded: true,
						alerts: result
					});
				},
				error => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			);
	}

	render() {
		const { error, isLoaded, loggedInUser, grdians, alerts } = this.state;
		// const grdians = loggedInUser.grdians;

		return (
			<React.Fragment>
				<button className="alert-button__main">
					<Link to="/alert">
						<h1>alert grdians</h1>
					</Link>
				</button>
				<section className="profile-panel">
					<div className="profile-panel__image">
						<img src={loggedInUser.imgURL} alt="Profile pic" />
					</div>
					<div className="profile-panel__info">
						<h3 className="profile-panel__info-element">
							{loggedInUser.firstName + " " + loggedInUser.lastName}
						</h3>
						<h3 className="profile-panel__info-element">
							{loggedInUser.phoneNumber}
						</h3>
						<h3 className="profile-panel__info-element">
							{loggedInUser.emailAddress}
						</h3>
					</div>
				</section>
				<section className="container-convo">
					<h2 className="title">Alerts</h2>
					{alerts.map(alert => (
						<Link to={"/alerts/" + alert.id}>
							<div key={alert.id} className="convo">
								<h4>{alert.senderFirstName + " " + alert.senderLastName}</h4>
								<p>{alert.message}</p>
							</div>
						</Link>
					))}
				</section>

				<div className="container-grdians">
					<h2 className="title">grdians</h2>
					<section className="profile-grdians">
						{grdians.map(grdian => (
							<div key={grdian.id} className="profile-grdians__image">
								<Link to={"/grdians/" + grdian.id}>
									<img src={"/" + grdian.imgURL} alt="grdian pic" />
								</Link>
							</div>
						))}
					</section>
				</div>
			</React.Fragment>
		);
	}
}

// REDUX-RELATED FUNCTIONS BELOW ---------------------------

const mapStateToProps = state => {
	return {
		loggedInUser: state.loggedInUser
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setLoggedInUserId: userId => {
			dispatch({
				type: "SET_ID",
				payload: userId
			});
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MainView);
