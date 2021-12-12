module Api
	module V1
		class LanesController < ApplicationController
			protect_from_forgery with: :null_session
				
			def index
				lanes = Lane.all

				render json: LaneSerializer.new(lanes).serializable_hash.to_json
			end

			def show
				lane = Lane.find_by(id: params[:id])

				render json: LaneSerializer.new(lane).serializable_hash.to_json
			end

			def create
				lane = Lane.new(lane_params)
        if lane.save
          render json: LaneSerializer.new(lane).serializable_hash.to_json
        else
          render json: { error: lane.errors.messages }, status: 422
        end
			end

			def update
        lane = Lane.find_by(id: params[:id])
        if lane.update(lane_params)
          render json: LaneSerializer.new(lane).serializable_hash.to_json
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
				params.require(:lane).permit(:id, :name, :project_id)
			end

		end
	end
end