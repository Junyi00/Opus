module Api
	module V1
		class LanesController < ApplicationController
			protect_from_forgery with: :null_session
				
			def index
				lanes = Lane.all
				
				render json: lanes
			end

			def show
				lane = Lane.find_by(id: params[:id])

				render json: lane
			end

			def create
				lane = Lane.new(lane_params)
        if lane.save

					render json: lane
        else
          render json: { error: lane.errors.messages }, status: 422
        end
			end

			def update
        lane = Lane.find_by(id: params[:id])
        if lane.update(lane_params)

					render json: lane
        else
          render json: { error: lane.errors.messages }, status: 422
        end
      end

			def destroy
        lane = Lane.find_by(id: params[:id])
        if lane.destroy
          head :no_content
        else
          render json: { errors: lane.errors }, status: 422
        end
      end
			
			private

			def lane_params
				params.require(:lane).permit(:id, :name, :pos, :project_id)
			end

		end
	end
end