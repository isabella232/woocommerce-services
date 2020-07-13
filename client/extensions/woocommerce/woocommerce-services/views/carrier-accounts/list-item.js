/** @format */

/**
 * External dependencies
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { localize } from 'i18n-calypso';
import { trim } from 'lodash';
import Gridicon from 'gridicons';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import CarrierIcon from '../../components/carrier-icon';
import Dialog from 'components/dialog';
import {
	getCarrierAccountsState,
} from 'woocommerce/woocommerce-services/state/carrier-accounts/selectors';
import {
	setVisibilityDisconnectCarrierDialog,
	disconnectCarrier,
} from 'woocommerce/woocommerce-services/state/carrier-accounts/actions';

const CarrierAccountListItem = ( props ) => {
	const {
		isPlaceholder,
		data,
		children,
		translate,
		siteId,
		showDisconnectDialog,
	} = props;
	if ( isPlaceholder ) {
		return (
			<div className="carrier-accounts__list-item">
				<div className="carrier-accounts__list-item-placeholder-carrier-icon">
					<div className="carrier-accounts__list-item-carrier-icion-placeholder">
						<span />
					</div>
				</div>
				<div className="carrier-accounts__list-item-name">
					<div className="carrier-accounts__list-item-name-placeholder">
						<span />
					</div>
				</div>
				<div className="carrier-accounts__list-item-actions">{ children }</div>
			</div>
		);
	}

	const renderIcon = carrierId => {
		return <div className="carrier-accounts__list-item-carrier-icon">
			<CarrierIcon carrier={ carrierId } size={ 18 } />
		</div>;
	};

	const renderName = name => {
		const carrierName = name && '' !== trim( name ) ? name : translate( 'Untitled' );
		return <div className="carrier-accounts__list-item-name">
			<span>{ carrierName }</span>
		</div>;
	};

	const renderCredentials = credentials => {
		return <div className="carrier-accounts__list-item-credentials">
			<span>{ credentials }</span>
		</div>;
	}

	const showDisconnectDialogHandler = () => {
		props.setVisibilityDisconnectCarrierDialog( siteId, data.carrierId, true );
	}

	const hideDisconnectDialogHandler = () => {
		props.setVisibilityDisconnectCarrierDialog( siteId, data.carrierId, false );
	}

	const renderActions = () => {
		const { credentials,  onConnect } = data;
		const connectButton = () => {
			return <Button compact onClick={ () => { onConnect( data ) } }>
				{ translate( 'Connect' ) }
			</Button>
		};
		const disconnectButton = () => {
			return <Button onClick={ showDisconnectDialogHandler } compact scary borderless >
				{ translate( 'Disconnect' ) }
			</Button>
		};
		return <div className="carrier-accounts__list-item-actions">
			{ credentials ? disconnectButton() : connectButton() }
		</div>;
	}

	const cancelDialogButton = () => {
		return [
			<Button compact primary onClick={ () => props.setVisibilityDisconnectCarrierDialog( siteId, data.carrierId, false ) }>{ translate( 'Cancel' ) }</Button>,
			<Button compact primary scary onClick={ () => props.disconnectCarrier( data.carrierId ) }>{ translate( 'Disconnect' ) }</Button>
		];
	}

	return (
		<div className="carrier-accounts__list-item">
			{ renderIcon( data.carrierId ) }
			{ renderName( data.name ) }
			{ renderCredentials( data.credentials ) }
			{ renderActions( data ) }
			<Dialog
				isVisible={ showDisconnectDialog }
				additionalClassNames="carrier-accounts__settings-cancel-dialog"
				onClose={ hideDisconnectDialogHandler }
				buttons={ cancelDialogButton() }
			>
				<div className="carrier-accounts__settings-cancel-dialog-header">
					<h2 className="carrier-accounts__settings-cancel-dialog-title">{ translate( 'Disconnect your UPS account' ) }</h2>
					<button className="carrier-accounts__settings-cancel-dialog-close-button" onClick={ hideDisconnectDialogHandler } ><Gridicon icon="cross"/></button>
				</div>
				<p className="carrier-accounts__settings-cancel-dialog-description">{ translate( 'This will remove the connection with UPS. All of your UPS account information will be deleted and you won’t see UPS rates when purchasing shipping labels.' ) }</p>
			</Dialog>
		</div>
	);
};

CarrierAccountListItem.propTypes = {
	siteId: PropTypes.number.isRequired,
	isPlaceholder: PropTypes.bool,
	data: PropTypes.shape( {
		name: PropTypes.string,
		carrierId: PropTypes.string,
		credentials: PropTypes.string,
	} ).isRequired,
};

const mapStateToProps = ( state, { siteId, data } ) => {

	const carrier                  = data.carrierId;
	const carrierAccountState      = getCarrierAccountsState( state, siteId, carrier );
	const { showDisconnectDialog } = carrierAccountState;


	const ret = {
		showDisconnectDialog,
	};

	return ret;
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			setVisibilityDisconnectCarrierDialog,
			disconnectCarrier,
		},
		dispatch
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( localize( CarrierAccountListItem ) );
