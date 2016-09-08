<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( class_exists( 'WC_REST_Connect_Shipping_Label_Refund_Controller' ) ) {
	return;
}

class WC_REST_Connect_Shipping_Label_Refund_Controller extends WP_REST_Controller {

	/**
	 * Endpoint namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'wc/v1';

	/**
	 * Route base.
	 *
	 * @var string
	 */
	protected $rest_base = 'connect/label/(?P<order_id>\d+)-(?P<label_id>\d+)/refund';

	/**
	 * @var WC_Connect_API_Client
	 */
	protected $api_client;

	public function __construct( WC_Connect_API_Client $api_client ) {
		$this->api_client = $api_client;
	}

	/**
	 * Register the routes for shipping labels printing.
	 */
	public function register_routes() {
		register_rest_route( $this->namespace, '/' . $this->rest_base, array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'update_items' ),
				'permission_callback' => array( $this, 'update_items_permissions_check' ),
			),
		) );
	}

	public function update_items( $request ) {
		// TODO: Uncomment this when the refund server endpoint is implemented
		// $response = $this->api_client->send_shipping_label_refund_request( $request[ 'label_id' ] );
		$response = new stdClass();
		$response->label = array(
			'refunded_time' => time() * 1000,
		);

		if ( is_wp_error( $response ) ) {
			return new WP_Error(
				$response->get_error_code(),
				$response->get_error_message(),
				array( 'message' => $response->get_error_message() )
			);
		}

		return array(
			'success' => true,
			'label' => $response->label,
		);
	}

	/**
	 * Validate the requester's permissions
	 */
	public function update_items_permissions_check( $request ) {
		return current_user_can( 'manage_woocommerce' );
	}

}
