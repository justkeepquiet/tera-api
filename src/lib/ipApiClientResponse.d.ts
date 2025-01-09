// Ref: https://ipapi.is/developers.html#api-response-format

export interface IpApiClientResponse {
	/**
	 * The IP address being analyzed
	 */
	ip: string;

	/**
	 * Regional Internet Registry managing this IP
	 */
	rir: string;

	/**
	 * Indicates if the IP is a bogon (invalid or reserved IP)
	 */
	is_bogon: boolean;

	/**
	 * Indicates if the IP belongs to a mobile network
	 */
	is_mobile: boolean;

	/**
	 * Indicates if the IP is used by web crawlers
	 */
	is_crawler: boolean;

	/**
	 * Indicates if the IP is associated with a data center
	 */
	is_datacenter: boolean;

	/**
	 * Indicates if the IP is part of the TOR network
	 */
	is_tor: boolean;

	/**
	 * Indicates if the IP is a proxy
	 */
	is_proxy: boolean;

	/**
	 * Indicates if the IP is associated with a VPN service
	 */
	is_vpn: boolean;

	/**
	 * Indicates if the IP has been flagged as abusive
	 */
	is_abuser: boolean;

	/**
	 * Information about the associated data center
	 */
	datacenter: Datacenter

	/**
	 * Information about the company associated with the IP
	 */
	company: Company

	/**
	 * Abuse contact information
	 */
	abuse: Abuse

	/**
	 * Autonomous System Number (ASN) information
	 */
	asn: Asn

	/**
	 * Geolocation information
	 */
	location: Location

	/**
	 * Time taken to analyze the IP, in milliseconds
	 */
	elapsed_ms: number;
}

export interface Datacenter {
	/**
	 * Name of the data center
	 */
	datacenter: string;

	/**
	 * Network range of the data center
	 */
	network: string;

	/**
	 * Country where the data center is located
	 */
	country: string;

	/**
	 * Region where the data center is located
	 */
	region: string;

	/**
	 * City where the data center is located
	 */
	city: string;
}

export interface Company {
	/**
	 * Name of the company
	 */
	name: string;

	/**
	 * Abuse score of the company
	 */
	abuser_score: string;

	/**
	 * Domain of the company
	 */
	domain: string;

	/**
	 * Type of company (e.g., hosting)
	 */
	type: string;

	/**
	 * Network range of the company
	 */
	network: string;

	/**
	 * WHOIS URL for more information about the network
	 */
	whois: string;
}

export interface Abuse {
	/**
	 * Name of the abuse contact
	 */
	name: string;

	/**
	 * Address of the abuse contact
	 */
	address: string;

	/**
	 * Email of the abuse contact
	 */
	email: string;

	/**
	 * Phone number of the abuse contact
	 */
	phone: string;
}

export interface Asn {
	/**
	 * ASN number
	 */
	asn: number;

	/**
	 * Abuse score of the ASN
	 */
	abuser_score: string;

	/**
	 * IP route of the ASN
	 */
	route: string;

	/**
	 * Description of the ASN
	 */
	descr: string;

	/**
	 * Country associated with the ASN
	 */
	country: string;

	/**
	 * Indicates if the ASN is active
	 */
	active: boolean;

	/**
	 * Organization name
	 */
	org: string;

	/**
	 * Domain of the organization
	 */
	domain: string;

	/**
	 * Abuse contact email for the ASN
	 */
	abuse: string;

	/**
	 * Type of organization (e.g., hosting)
	 */
	type: string;

	/**
	 * Creation date of the ASN
	 */
	created: string;

	/**
	 * Last updated date of the ASN
	 */
	updated: string;

	/**
	 * Regional Internet Registry managing this ASN
	 */
	rir: string;

	/**
	 * WHOIS URL for more information about the ASN
	 */
	whois: string;
}

export interface Location {
	/**
	 * Continent of the IP
	 */
	continent: string;

	/**
	 * Country of the IP
	 */
	country: string;

	/**
	 * ISO code of the country
	 */
	country_code: string;

	/**
	 * State of the IP
	 */
	state: string;

	/**
	 * City of the IP
	 */
	city: string;

	/**
	 * Latitude of the IP location
	 */
	latitude: number;

	/**
	 * Longitude of the IP location
	 */
	longitude: number;

	/**
	 * ZIP code of the IP location
	 */
	zip: string;

	/**
	 * Timezone of the IP location
	 */
	timezone: string;

	/**
	 * Local time at the IP location
	 */
	local_time: string;

	/**
	 * Local time in UNIX format
	 */
	local_time_unix: number;

	/**
	 * Indicates if daylight saving time is active
	 */
	is_dst: boolean;
}