import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class MainView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedInUser: {
				id: -1,
				firstName: "No User Logged In",
				lastName: "",
				imgURL: "",
				phoneNumber: "",
				emailAddress: "",
				activeAlertId: -1,
				grdians: []
			}
		};
	}

	componentDidMount() {
		const loggedInUserId = this.props.loggedInUser.id;
		if (loggedInUserId == -1) {
			this.props.history.push("/login");
		} else {
			fetch("http://localhost:8080/api/allgrdians/" + loggedInUserId)
				.then(res => res.json())
				.then(
					result => {
						this.setState({
							isLoaded: true,
							loggedInUser: result
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
	}

	render() {
		return (
			<React.Fragment>
				<h3>
					User:
					{this.state.loggedInUser.firstName +
						" " +
						this.state.loggedInUser.lastName}
				</h3>
				<Link to="/login">
					<h3>LoginForm</h3>
				</Link>
				<Link to="/signup">
					<h3>SignUpForm</h3>
				</Link>
				<Link to="/alert">
					<h3>AlertForm</h3>
				</Link>
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
