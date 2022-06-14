/*
ShellHub Community

ShellHub Community documentation.  It documents all routes provided by ShellHub Community.   NOTICE: THE API IS NOT STABLE YET; ERROR AND INCONSISTENCIES MAY OCCUR. 

API version: 0.1.0
Contact: contato@ossystems.com.br
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package openapi

import (
	"encoding/json"
)

// RenameTagRequest struct for RenameTagRequest
type RenameTagRequest struct {
	// Tag's name.
	Tag *string `json:"tag,omitempty"`
}

// NewRenameTagRequest instantiates a new RenameTagRequest object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewRenameTagRequest() *RenameTagRequest {
	this := RenameTagRequest{}
	return &this
}

// NewRenameTagRequestWithDefaults instantiates a new RenameTagRequest object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewRenameTagRequestWithDefaults() *RenameTagRequest {
	this := RenameTagRequest{}
	return &this
}

// GetTag returns the Tag field value if set, zero value otherwise.
func (o *RenameTagRequest) GetTag() string {
	if o == nil || o.Tag == nil {
		var ret string
		return ret
	}
	return *o.Tag
}

// GetTagOk returns a tuple with the Tag field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *RenameTagRequest) GetTagOk() (*string, bool) {
	if o == nil || o.Tag == nil {
		return nil, false
	}
	return o.Tag, true
}

// HasTag returns a boolean if a field has been set.
func (o *RenameTagRequest) HasTag() bool {
	if o != nil && o.Tag != nil {
		return true
	}

	return false
}

// SetTag gets a reference to the given string and assigns it to the Tag field.
func (o *RenameTagRequest) SetTag(v string) {
	o.Tag = &v
}

func (o RenameTagRequest) MarshalJSON() ([]byte, error) {
	toSerialize := map[string]interface{}{}
	if o.Tag != nil {
		toSerialize["tag"] = o.Tag
	}
	return json.Marshal(toSerialize)
}

type NullableRenameTagRequest struct {
	value *RenameTagRequest
	isSet bool
}

func (v NullableRenameTagRequest) Get() *RenameTagRequest {
	return v.value
}

func (v *NullableRenameTagRequest) Set(val *RenameTagRequest) {
	v.value = val
	v.isSet = true
}

func (v NullableRenameTagRequest) IsSet() bool {
	return v.isSet
}

func (v *NullableRenameTagRequest) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableRenameTagRequest(val *RenameTagRequest) *NullableRenameTagRequest {
	return &NullableRenameTagRequest{value: val, isSet: true}
}

func (v NullableRenameTagRequest) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableRenameTagRequest) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


