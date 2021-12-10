package services

import (
	"context"
	"errors"
	"testing"

	storecache "github.com/shellhub-io/shellhub/api/cache"
	"github.com/shellhub-io/shellhub/api/store"
	"github.com/shellhub-io/shellhub/api/store/mocks"
	mocksGeoIp "github.com/shellhub-io/shellhub/pkg/geoip/mocks"
	"github.com/shellhub-io/shellhub/pkg/models"
	"github.com/stretchr/testify/assert"
)

func TestCreateToken(t *testing.T) {
	mock := &mocks.Store{}

	ctx := context.TODO()

	locator := &mocksGeoIp.Locator{}

	svc := NewService(store.Store(mock), privateKey, publicKey, storecache.NewNullCache(), clientMock, locator)

	token := models.Token{
		ID:       "1",
		TenantID: "a736a52b-5777-4f92-b0b8-e359bf484713",
		ReadOnly: true,
	}

	namespace := &models.Namespace{Name: "group1", Owner: "hash1", TenantID: "a736a52b-5777-4f92-b0b8-e359bf484713", Tokens: []models.Token{}}

	mock.On("TokenCreate", ctx, namespace.TenantID).Return(&token, nil).Once()
	mock.On("NamespaceGet", ctx, namespace.TenantID).Return(namespace, nil)

	_, err := svc.CreateToken(ctx, namespace.TenantID)
	assert.NoError(t, err)
}

func TestListToken(t *testing.T) {
	mock := &mocks.Store{}

	ctx := context.TODO()

	locator := &mocksGeoIp.Locator{}

	svc := NewService(store.Store(mock), privateKey, publicKey, storecache.NewNullCache(), clientMock, locator)

	Err := errors.New("error")

	token := models.Token{
		ID:       "1",
		TenantID: "a736a52b-5777-4f92-b0b8-e359bf484713",
		ReadOnly: true,
	}

	namespace := &models.Namespace{Name: "group1", Owner: "hash1", TenantID: "a736a52b-5777-4f92-b0b8-e359bf484713", Tokens: []models.Token{}}

	mock.On("TokenCreate", ctx, namespace.TenantID).Return(&token, nil).Once()
	mock.On("NamespaceGet", ctx, namespace.TenantID).Return(namespace, nil)

	createdToken, err := svc.CreateToken(ctx, namespace.TenantID)
	assert.NoError(t, err)

	var tokenList []models.Token
	tokenList = append(tokenList, *createdToken)

	type Expected struct {
		userToken []models.Token
		err       error
	}

	tests := []struct {
		description   string
		args          *models.Namespace
		requiredMocks func()
		expected      Expected
	}{
		{
			description: "Fails the namespace not found",
			args:        namespace,
			requiredMocks: func() {
				mock.On("TokenList", ctx, namespace.TenantID).Return(nil, Err).Once()
			},
			expected: Expected{nil, Err},
		},
		{
			description: "Fails no API Token stored",
			args:        namespace,
			requiredMocks: func() {
				mock.On("TokenList", ctx, namespace.TenantID).Return(nil, Err).Once()
			},
			expected: Expected{nil, Err},
		},
		{
			description: "Successful list the tokens",
			args:        namespace,
			requiredMocks: func() {
				mock.On("TokenList", ctx, namespace.TenantID).Return(tokenList, nil).Once()
			},
			expected: Expected{tokenList, nil},
		},
	}

	for _, test := range tests {
		t.Log("PASS:  ", test.description)
		test.requiredMocks()
		tokenList, err := svc.ListToken(ctx, test.args.TenantID)
		assert.Equal(t, test.expected, Expected{tokenList, err})
	}

	mock.AssertExpectations(t)
}

func TestGetToken(t *testing.T) {
	mock := &mocks.Store{}

	ctx := context.TODO()

	locator := &mocksGeoIp.Locator{}

	svc := NewService(store.Store(mock), privateKey, publicKey, storecache.NewNullCache(), clientMock, locator)

	Err := errors.New("error")

	token := models.Token{
		ID:       "1",
		TenantID: "a736a52b-5777-4f92-b0b8-e359bf484713",
		ReadOnly: true,
	}

	namespace := &models.Namespace{Name: "group1", Owner: "hash1", TenantID: "a736a52b-5777-4f92-b0b8-e359bf484713", Tokens: []models.Token{}}

	mock.On("TokenCreate", ctx, namespace.TenantID).Return(&token, nil).Once()
	mock.On("NamespaceGet", ctx, namespace.TenantID).Return(namespace, nil)

	createdToken, err := svc.CreateToken(ctx, namespace.TenantID)
	assert.NoError(t, err)

	type Expected struct {
		userToken *models.Token
		err       error
	}

	tests := []struct {
		description   string
		args          *models.Namespace
		requiredMocks func()
		expected      Expected
	}{
		{
			description: "Fails the namespace not found",
			args:        namespace,
			requiredMocks: func() {
				mock.On("TokenGet", ctx, namespace.TenantID, createdToken.ID).Return(nil, Err).Once()
			},
			expected: Expected{nil, Err},
		},
		{
			description: "Fails API Token ID invalid",
			args:        namespace,
			requiredMocks: func() {
				mock.On("TokenGet", ctx, namespace.TenantID, createdToken.ID).Return(nil, Err).Once()
			},
			expected: Expected{nil, Err},
		},
		{
			description: "Successful get the API token",
			args:        namespace,
			requiredMocks: func() {
				mock.On("TokenGet", ctx, namespace.TenantID, createdToken.ID).Return(createdToken, nil).Once()
			},
			expected: Expected{createdToken, nil},
		},
	}

	for _, test := range tests {
		t.Log("PASS:  ", test.description)
		test.requiredMocks()
		apiToken, err := svc.GetToken(ctx, test.args.TenantID, createdToken.ID)
		assert.Equal(t, test.expected, Expected{apiToken, err})
	}

	mock.AssertExpectations(t)
}

func TestDeleteToken(t *testing.T) {
	//mock := &mocks.Store{}
	//
	//ctx := context.TODO()
	//
	//locator := &mocksGeoIp.Locator{}
	//
	//svc := NewService(store.Store(mock), privateKey, publicKey, storecache.NewNullCache(), clientMock, locator)
	//
	//Err := errors.New("error")
	//
	//token := models.Token{
	//	ID:       "1",
	//	TenantID: "a736a52b-5777-4f92-b0b8-e359bf484713",
	//	ReadOnly: true,
	//}
	//
	//namespace := &models.Namespace{Name: "group1", Owner: "hash1", TenantID: "a736a52b-5777-4f92-b0b8-e359bf484713", Tokens: []models.Token{}}
	//
	////mock.On("TokenCreate", ctx, namespace.TenantID).Return(&token, nil).Once()
	//mock.On("GetToken", ctx, namespace.TenantID, "hash1").Return(token, nil)
	//mock.On("NamespaceGet", ctx, namespace.TenantID).Return(namespace, nil)
	//mock.On("TokenGet").Return(token, nil)
	//
	////createdToken, err := svc.CreateToken(ctx, namespace.TenantID)
	////assert.NoError(t, err)
	//
	//tests := []struct {
	//	description   string
	//	namespace     *models.Namespace
	//	token         *models.Token
	//	requiredMocks func()
	//	expected      error
	//}{
	//	{
	//		description: "Fails the namespace not found",
	//		namespace:   namespace,
	//		token:       &token,
	//		requiredMocks: func() {
	//			mock.On("TokenDelete", ctx, namespace.TenantID, token.ID).Return(Err).Once()
	//		},
	//		expected: Err,
	//	},
	//	{
	//		description: "Fails API Token ID invalid",
	//		namespace:   namespace,
	//		token:       &token,
	//		requiredMocks: func() {
	//			mock.On("TokenDelete", ctx, namespace.TenantID, token.ID).Return(Err).Once()
	//		},
	//		expected: Err,
	//	},
	//	{
	//		description: "Successful delete the API token",
	//		namespace:   namespace,
	//		token:       &token,
	//		requiredMocks: func() {
	//			mock.On("TokenDelete", ctx, namespace.TenantID, token.ID).Return(nil).Once()
	//		},
	//		expected: nil,
	//	},
	//}
	//
	//for _, test := range tests {
	//	t.Log("PASS:  ", test.description)
	//	test.requiredMocks()
	//	err := svc.DeleteToken(ctx, test.namespace.TenantID, token.ID)
	//	assert.Equal(t, test.expected, err)
	//}
	//
	//mock.AssertExpectations(t)
}

func TestUpdateToken(t *testing.T) {
	//mock := &mocks.Store{}
	//
	//ctx := context.TODO()
	//
	//locator := &mocksGeoIp.Locator{}
	//
	//svc := NewService(store.Store(mock), privateKey, publicKey, storecache.NewNullCache(), clientMock, locator)
	//
	//Err := errors.New("error")
	//
	//token := models.Token{
	//	ID:       "1",
	//	TenantID: "a736a52b-5777-4f92-b0b8-e359bf484713",
	//	ReadOnly: true,
	//}
	//
	//namespace := &models.Namespace{Name: "group1", Owner: "hash1", TenantID: "a736a52b-5777-4f92-b0b8-e359bf484713", Tokens: []models.Token{}}
	//
	//mock.On("TokenCreate", ctx, namespace.TenantID).Return(&token, nil).Once()
	//
	//createdToken, err := svc.CreateToken(ctx, namespace.TenantID)
	//assert.NoError(t, err)
	//
	//req := &models.TokenUpdate{
	//	TokenFields: models.TokenFields{ReadOnly: false},
	//}
	//
	//tests := []struct {
	//	description   string
	//	namespace     *models.Namespace
	//	token         *models.Token
	//	requiredMocks func()
	//	expected      error
	//}{
	//	{
	//		description: "Fails the namespace not found",
	//		namespace:   namespace,
	//		token:       createdToken,
	//		requiredMocks: func() {
	//			mock.On("TokenUpdate", ctx, namespace.TenantID, createdToken.ID, req).Return(Err).Once()
	//			mock.On("TokenGet", ctx, namespace.TenantID, createdToken.ID).Return(nil, Err).Once()
	//		},
	//		expected: Err,
	//	},
	//	{
	//		description: "Fails API Token ID invalid",
	//		namespace:   namespace,
	//		token:       createdToken,
	//		requiredMocks: func() {
	//			mock.On("TokenUpdate", ctx, namespace.TenantID, createdToken.ID, req).Return(Err).Once()
	//			mock.On("TokenGet", ctx, namespace.TenantID, createdToken.ID).Return(nil, Err).Once()
	//		},
	//		expected: Err,
	//	},
	//	{
	//		description: "Successful delete the API token",
	//		namespace:   namespace,
	//		token:       createdToken,
	//		requiredMocks: func() {
	//			mock.On("TokenUpdate", ctx, namespace.TenantID, createdToken.ID, req).Return(nil).Once()
	//			mock.On("TokenGet", ctx, namespace.TenantID, createdToken.ID).Return(createdToken, nil).Once()
	//		},
	//		expected: nil,
	//	},
	//}
	//
	//for _, test := range tests {
	//	t.Log("PASS:  ", test.description)
	//	test.requiredMocks()
	//	err := svc.UpdateToken(ctx, test.namespace.TenantID, createdToken.ID, req)
	//	assert.Equal(t, test.expected, err)
	//}
}
