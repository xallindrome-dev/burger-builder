import React, { Component } from 'react'

import Spinner from '../../../components/UI/Spinner/Spinner'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.css'
import { connect } from 'react-redux';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';

import Input from '../../../components/UI/Input/Input'
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 2
                },
                valid: false,
                touched: false,
                validationError: "Please enter your full valid name!"
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                validationError: "Please enter a valid street address!"
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false,
                validationError: "Please enter a valid zip code (5 characters)!"
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                validationError: "Please enter a valid country!"
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                validationError: "Please enter a valid email address!"
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: '', displayValue: 'Select a Shipping Method' },
                        { value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' }
                    ]
                },
                value: 'fastest',
                validation: {
                    minLength: 1
                },
                valid: true
            }
        },
        formIsValid: false,
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();

        const formData = {};
        for (const formElementIdentifier in this.state.orderForm) {
            if (this.state.orderForm.hasOwnProperty(formElementIdentifier)) {
                const element = this.state.orderForm[formElementIdentifier];
                formData[formElementIdentifier] = element.value;
            }
        }

        const { ings, price, userId, token } = this.props;

        const order = {
            ingredients: ings,
            price,
            orderData: formData,
            userId
        };

        this.props.onOrderBurger(order, token);
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const { target } = event;

        const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], {
            value: target.value,
            valid: checkValidity(target.value, this.state.orderForm[inputIdentifier].validation),
            touched: true
        });

        const updatedOrderForm = updateObject(this.state.orderForm, {
            [inputIdentifier]: updatedFormElement
        });

        let formIsValid = true;
        for (const inputIdentifier in updatedOrderForm) {
            if (updatedOrderForm.hasOwnProperty(inputIdentifier)) {
                const isValid = updatedOrderForm[inputIdentifier].valid;
                formIsValid &= isValid;
            }
        }
        this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid })
    }

    render() {
        const formElementsArray = [];
        for (const key in this.state.orderForm) {
            if (this.state.orderForm.hasOwnProperty(key)) {
                const element = this.state.orderForm[key];
                formElementsArray.push({
                    id: key,
                    config: element
                });
            }
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map((formElement) => {
                    return (
                        <Input
                            key={formElement.id}
                            elementType={formElement.config.elementType}
                            elementConfig={formElement.config.elementConfig}
                            value={formElement.config.value}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            validationError={formElement.config.validationError}
                            changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                    );
                })}
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );
        if (this.props.loading) {
            form = <Spinner />
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { burgerBuilder, order, auth } = state;
    return {
        ings: burgerBuilder.ingredients,
        price: burgerBuilder.totalPrice,
        loading: order.loading,
        token: auth.token,
        userId: auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
