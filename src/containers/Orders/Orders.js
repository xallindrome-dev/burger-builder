import React, { Component } from 'react'

import Order from '../../components/Order/Order'
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
  componentDidMount() {
    const { token, userId } = this.props;
    this.props.onFetchOrders(token, userId);
  }

  render() {
    let ordersContainer = <Spinner />;

    const { loading, orders } = this.props;

    if (!loading && orders) {
      ordersContainer = orders.map(order => {
        return (
          <Order
            key={order.id}
            ingredients={order.ingredients}
            price={+order.price} />
        );
      });
    }

    return (
      <div>
        {ordersContainer}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { order, auth } = state;
  return {
    orders: order.orders,
    loading: order.loading,
    token: auth.token,
    userId: auth.userId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));
