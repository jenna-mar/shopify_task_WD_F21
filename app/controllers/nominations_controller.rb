class NominationsController < ApplicationController
    skip_before_action :verify_authenticity_token

    # GET
    def index
        @nominations = Nomination.all
        render json: @nominations, status: :ok
    end

    # POST
    def create
        @nomination = Nomination.create!(nomination_params)
        render json: @nomination, status: :created
    end

    def show
        render json: @nominations, status: :ok
    end

    # DELETE
    def destroy
        @n = Nomination.find(params[:id])
        @n.destroy
        head :no_content
    end

    private
        def nomination_params
            params.permit(:title, :year, :imdbID)
        end
end