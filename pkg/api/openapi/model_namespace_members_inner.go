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

// NamespaceMembersInner struct for NamespaceMembersInner
type NamespaceMembersInner struct {
	// User's ID.
	Id *string `json:"id,omitempty"`
	Role *NamespaceMemberRole `json:"role,omitempty"`
}

// NewNamespaceMembersInner instantiates a new NamespaceMembersInner object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewNamespaceMembersInner() *NamespaceMembersInner {
	this := NamespaceMembersInner{}
	return &this
}

// NewNamespaceMembersInnerWithDefaults instantiates a new NamespaceMembersInner object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewNamespaceMembersInnerWithDefaults() *NamespaceMembersInner {
	this := NamespaceMembersInner{}
	return &this
}

// GetId returns the Id field value if set, zero value otherwise.
func (o *NamespaceMembersInner) GetId() string {
	if o == nil || o.Id == nil {
		var ret string
		return ret
	}
	return *o.Id
}

// GetIdOk returns a tuple with the Id field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *NamespaceMembersInner) GetIdOk() (*string, bool) {
	if o == nil || o.Id == nil {
		return nil, false
	}
	return o.Id, true
}

// HasId returns a boolean if a field has been set.
func (o *NamespaceMembersInner) HasId() bool {
	if o != nil && o.Id != nil {
		return true
	}

	return false
}

// SetId gets a reference to the given string and assigns it to the Id field.
func (o *NamespaceMembersInner) SetId(v string) {
	o.Id = &v
}

// GetRole returns the Role field value if set, zero value otherwise.
func (o *NamespaceMembersInner) GetRole() NamespaceMemberRole {
	if o == nil || o.Role == nil {
		var ret NamespaceMemberRole
		return ret
	}
	return *o.Role
}

// GetRoleOk returns a tuple with the Role field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *NamespaceMembersInner) GetRoleOk() (*NamespaceMemberRole, bool) {
	if o == nil || o.Role == nil {
		return nil, false
	}
	return o.Role, true
}

// HasRole returns a boolean if a field has been set.
func (o *NamespaceMembersInner) HasRole() bool {
	if o != nil && o.Role != nil {
		return true
	}

	return false
}

// SetRole gets a reference to the given NamespaceMemberRole and assigns it to the Role field.
func (o *NamespaceMembersInner) SetRole(v NamespaceMemberRole) {
	o.Role = &v
}

func (o NamespaceMembersInner) MarshalJSON() ([]byte, error) {
	toSerialize := map[string]interface{}{}
	if o.Id != nil {
		toSerialize["id"] = o.Id
	}
	if o.Role != nil {
		toSerialize["role"] = o.Role
	}
	return json.Marshal(toSerialize)
}

type NullableNamespaceMembersInner struct {
	value *NamespaceMembersInner
	isSet bool
}

func (v NullableNamespaceMembersInner) Get() *NamespaceMembersInner {
	return v.value
}

func (v *NullableNamespaceMembersInner) Set(val *NamespaceMembersInner) {
	v.value = val
	v.isSet = true
}

func (v NullableNamespaceMembersInner) IsSet() bool {
	return v.isSet
}

func (v *NullableNamespaceMembersInner) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableNamespaceMembersInner(val *NamespaceMembersInner) *NullableNamespaceMembersInner {
	return &NullableNamespaceMembersInner{value: val, isSet: true}
}

func (v NullableNamespaceMembersInner) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableNamespaceMembersInner) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


