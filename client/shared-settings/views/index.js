import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionButtons from 'components/action-buttons';
import CompactCard from 'components/card/compact';
import GlobalNotices from 'components/global-notices';
import notices from 'notices';
import PaymentMethodSelector from 'components/payment-method-selector';
import { sprintf } from 'sprintf-js';
import { translate as __ } from 'lib/mixins/i18n';
import * as actions from 'lib/form-base/actions';

const SharedSettingsRootView = ( props ) => {
	const onPaymentMethodChange = ( value ) => props.actions.setFormDataValue( 'selected_payment_method_id', value );

	const saveForm = ( key, value ) => {
		console.log( 'in SharedSettingsRootView saveForm, key=', key );
		console.log( 'in SharedSettingsRootView saveForm, value=', value );
		// todo - set state and initiate save
	};

	const paymentMethodDescriptionFormat = __( 'Manage your payment methods on %(startLink)sWordPress.com%(endLink)s' );
	const paymentMethodDescription = sprintf(
		paymentMethodDescriptionFormat,
		{
			startLink: '<a href="https://wordpress.com/me/billing" target="_blank">',
			endLink: '</a>',
		}
	);

	const buttons = [
		{
			label: __( 'Save changes' ),
			onClick: saveForm,
			isPrimary: true,
			isDisabled: false,
		},
	];

	return (
		<div className="wcc-container">
			<GlobalNotices id="notices" notices={ notices.list } />
			<CompactCard>
				<PaymentMethodSelector
					description={ paymentMethodDescription }
					paymentMethods={ props.formMeta.payment_methods }
					onChange={ onPaymentMethodChange }
					title={ __( 'Payment Method' ) }
					value={ props.formData.selected_payment_method_id }
				/>
			</CompactCard>
			<CompactCard className="save-button-bar">
				<ActionButtons
					buttons={ buttons }
				/>
			</CompactCard>
		</div>
	);
};

SharedSettingsRootView.propTypes = {
	saveForm: PropTypes.func,
	storeOptions: PropTypes.object.isRequired,
};

function mapStateToProps( state ) {
	return {
		formData: state.form.data,
		formMeta: state.form.meta,
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		actions: bindActionCreators( actions, dispatch ),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( SharedSettingsRootView );
